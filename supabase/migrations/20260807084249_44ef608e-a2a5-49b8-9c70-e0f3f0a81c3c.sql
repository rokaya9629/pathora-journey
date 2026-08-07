-- roles
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- careers
CREATE TABLE public.careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Technology',
  market_demand text NOT NULL DEFAULT 'High',
  demand_score int NOT NULL DEFAULT 70,
  avg_salary text,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.careers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.careers TO authenticated;
GRANT ALL ON public.careers TO service_role;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "careers public read" ON public.careers FOR SELECT USING (true);
CREATE POLICY "careers admin write" ON public.careers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.career_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
  skill text NOT NULL,
  importance int NOT NULL DEFAULT 3
);
GRANT SELECT ON public.career_skills TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.career_skills TO authenticated;
GRANT ALL ON public.career_skills TO service_role;
ALTER TABLE public.career_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "career_skills public read" ON public.career_skills FOR SELECT USING (true);
CREATE POLICY "career_skills admin write" ON public.career_skills FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.roadmaps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmaps TO authenticated;
GRANT ALL ON public.roadmaps TO service_role;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roadmaps public read" ON public.roadmaps FOR SELECT USING (true);
CREATE POLICY "roadmaps admin write" ON public.roadmaps FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.roadmap_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id uuid NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 1,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  est_weeks int NOT NULL DEFAULT 2
);
GRANT SELECT ON public.roadmap_steps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmap_steps TO authenticated;
GRANT ALL ON public.roadmap_steps TO service_role;
ALTER TABLE public.roadmap_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roadmap_steps public read" ON public.roadmap_steps FOR SELECT USING (true);
CREATE POLICY "roadmap_steps admin write" ON public.roadmap_steps FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  difficulty text NOT NULL DEFAULT 'Beginner',
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.resources TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resources public read" ON public.resources FOR SELECT USING (true);
CREATE POLICY "resources admin write" ON public.resources FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'Internship',
  organization text,
  deadline date,
  url text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.opportunities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunities TO authenticated;
GRANT ALL ON public.opportunities TO service_role;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "opportunities public read" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "opportunities admin write" ON public.opportunities FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'award',
  xp_reward int NOT NULL DEFAULT 50
);
GRANT SELECT ON public.achievements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements public read" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "achievements admin write" ON public.achievements FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- user data
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  avatar_url text,
  headline text,
  education_level text,
  major text,
  current_skills text[] NOT NULL DEFAULT '{}',
  interests text[] NOT NULL DEFAULT '{}',
  dream_career text,
  career_goal_id uuid REFERENCES public.careers(id) ON DELETE SET NULL,
  onboarding_complete boolean NOT NULL DEFAULT false,
  xp int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  technologies text[] NOT NULL DEFAULT '{}',
  github_url text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own projects" ON public.projects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  issuer text NOT NULL DEFAULT '',
  issue_date date,
  url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own certificates" ON public.certificates FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_roadmap_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id uuid NOT NULL REFERENCES public.roadmap_steps(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, step_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roadmap_progress TO authenticated;
GRANT ALL ON public.user_roadmap_progress TO service_role;
ALTER TABLE public.user_roadmap_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own progress" ON public.user_roadmap_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.xp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount int NOT NULL DEFAULT 10,
  reason text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.xp_events TO authenticated;
GRANT ALL ON public.xp_events TO service_role;
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own xp read" ON public.xp_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own xp insert" ON public.xp_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);
GRANT SELECT, INSERT ON public.user_achievements TO authenticated;
GRANT ALL ON public.user_achievements TO service_role;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own achievements read" ON public.user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own achievements insert" ON public.user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- seed careers
INSERT INTO public.careers (slug, title, description, category, market_demand, demand_score, avg_salary, tags) VALUES
('cybersecurity-engineer','Cybersecurity Engineer','Protect organizations from digital threats by designing secure systems, monitoring networks, and responding to incidents.','Security','Very High',94,'$95k - $140k','{security,networking,linux}'),
('data-scientist','Data Scientist','Turn raw data into decisions using statistics, machine learning, and clear storytelling.','Data','Very High',92,'$100k - $150k','{python,statistics,ml}'),
('frontend-engineer','Frontend Engineer','Build fast, accessible interfaces that people love using, from design systems to production apps.','Engineering','High',88,'$80k - $130k','{react,typescript,ui}'),
('ai-ml-engineer','AI / ML Engineer','Design, train, and ship machine learning systems into real products.','AI','Very High',96,'$110k - $170k','{python,pytorch,mlops}'),
('cloud-devops-engineer','Cloud / DevOps Engineer','Automate infrastructure, deployments, and reliability for modern cloud platforms.','Infrastructure','High',90,'$95k - $145k','{aws,docker,kubernetes}'),
('product-designer','Product Designer','Research, prototype, and design digital products end to end.','Design','Medium',76,'$70k - $120k','{figma,research,ux}');

INSERT INTO public.career_skills (career_id, skill, importance)
SELECT c.id, s.skill, s.importance FROM public.careers c
JOIN (VALUES
 ('cybersecurity-engineer','Networking',5),('cybersecurity-engineer','Linux',5),('cybersecurity-engineer','Python',4),('cybersecurity-engineer','Security Fundamentals',5),('cybersecurity-engineer','SOC Operations',4),('cybersecurity-engineer','Incident Response',3),
 ('data-scientist','Python',5),('data-scientist','SQL',5),('data-scientist','Statistics',5),('data-scientist','Machine Learning',4),('data-scientist','Data Visualization',3),('data-scientist','Pandas',4),
 ('frontend-engineer','HTML & CSS',5),('frontend-engineer','JavaScript',5),('frontend-engineer','React',5),('frontend-engineer','TypeScript',4),('frontend-engineer','Accessibility',3),('frontend-engineer','Testing',3),
 ('ai-ml-engineer','Python',5),('ai-ml-engineer','Linear Algebra',4),('ai-ml-engineer','Machine Learning',5),('ai-ml-engineer','Deep Learning',5),('ai-ml-engineer','PyTorch',4),('ai-ml-engineer','MLOps',3),
 ('cloud-devops-engineer','Linux',5),('cloud-devops-engineer','Docker',5),('cloud-devops-engineer','Kubernetes',4),('cloud-devops-engineer','CI/CD',4),('cloud-devops-engineer','AWS',5),('cloud-devops-engineer','Terraform',3),
 ('product-designer','UX Research',5),('product-designer','Figma',5),('product-designer','Prototyping',4),('product-designer','Visual Design',4),('product-designer','Design Systems',3),('product-designer','Usability Testing',3)
) AS s(slug, skill, importance) ON s.slug = c.slug;

INSERT INTO public.roadmaps (career_id, title, description)
SELECT id, title || ' Roadmap', 'A step-by-step path from beginner to job-ready ' || title || '.' FROM public.careers;

INSERT INTO public.roadmap_steps (roadmap_id, position, title, description, est_weeks)
SELECT r.id, s.position, s.title, s.description, s.est_weeks
FROM public.roadmaps r JOIN public.careers c ON c.id = r.career_id
JOIN (VALUES
 ('cybersecurity-engineer',1,'Networking','TCP/IP, DNS, routing, and how packets actually move.',3),
 ('cybersecurity-engineer',2,'Linux','Shell, permissions, processes, and system hardening.',3),
 ('cybersecurity-engineer',3,'Python','Automate scanning, parsing logs, and small security tools.',4),
 ('cybersecurity-engineer',4,'Security Fundamentals','CIA triad, cryptography basics, OWASP Top 10.',4),
 ('cybersecurity-engineer',5,'SOC Operations','SIEM, alert triage, threat hunting, and reporting.',5),
 ('data-scientist',1,'Python & Pandas','Data wrangling and clean notebooks.',4),
 ('data-scientist',2,'SQL','Joins, window functions, and analytics queries.',3),
 ('data-scientist',3,'Statistics','Distributions, inference, and experiment design.',4),
 ('data-scientist',4,'Machine Learning','Regression, trees, validation, and metrics.',5),
 ('data-scientist',5,'Capstone Project','End-to-end analysis with a public dataset.',4),
 ('frontend-engineer',1,'HTML & CSS','Semantics, layout, responsive design.',3),
 ('frontend-engineer',2,'JavaScript','Language core, DOM, async patterns.',4),
 ('frontend-engineer',3,'React','Components, state, data fetching.',5),
 ('frontend-engineer',4,'TypeScript','Types, generics, safe refactors.',3),
 ('frontend-engineer',5,'Ship a Product','Deploy a real app with auth and a database.',4),
 ('ai-ml-engineer',1,'Python for ML','NumPy, vectorization, tooling.',3),
 ('ai-ml-engineer',2,'Math Foundations','Linear algebra, calculus, probability.',5),
 ('ai-ml-engineer',3,'Classical ML','Supervised learning and evaluation.',4),
 ('ai-ml-engineer',4,'Deep Learning','Neural nets, training loops, PyTorch.',6),
 ('ai-ml-engineer',5,'MLOps','Serving, monitoring, and reproducibility.',4),
 ('cloud-devops-engineer',1,'Linux & Bash','Operate servers with confidence.',3),
 ('cloud-devops-engineer',2,'Networking & Git','Version control and cloud networking basics.',2),
 ('cloud-devops-engineer',3,'Docker','Images, volumes, compose.',3),
 ('cloud-devops-engineer',4,'CI/CD','Pipelines, testing gates, releases.',3),
 ('cloud-devops-engineer',5,'Kubernetes & IaC','Clusters, Helm, Terraform.',6),
 ('product-designer',1,'Design Foundations','Type, color, hierarchy, layout.',3),
 ('product-designer',2,'Figma Mastery','Components, auto layout, variables.',3),
 ('product-designer',3,'UX Research','Interviews, synthesis, insights.',4),
 ('product-designer',4,'Prototyping','Flows, interaction, motion.',3),
 ('product-designer',5,'Portfolio Case Study','Tell one project story deeply.',4)
) AS s(slug, position, title, description, est_weeks) ON s.slug = c.slug;

INSERT INTO public.resources (title, description, category, difficulty, url) VALUES
('CS50: Introduction to Computer Science','Harvard''s legendary intro to CS — problem solving, C, Python, and algorithms.','Computer Science','Beginner','https://cs50.harvard.edu/x/'),
('freeCodeCamp Responsive Web Design','Hands-on HTML and CSS certification with real projects.','Frontend','Beginner','https://www.freecodecamp.org/learn/2022/responsive-web-design/'),
('The Odin Project','Full open-source path to a full-stack job-ready portfolio.','Full Stack','Intermediate','https://www.theodinproject.com/'),
('TryHackMe','Guided, gamified hands-on cybersecurity labs.','Cybersecurity','Beginner','https://tryhackme.com/'),
('OWASP Top 10','The canonical list of critical web application security risks.','Cybersecurity','Intermediate','https://owasp.org/www-project-top-ten/'),
('Kaggle Learn','Short practical courses on Python, pandas, and machine learning.','Data','Beginner','https://www.kaggle.com/learn'),
('fast.ai Practical Deep Learning','Top-down deep learning course for coders.','AI','Intermediate','https://course.fast.ai/'),
('Docker Getting Started','Official hands-on introduction to containers.','DevOps','Beginner','https://docs.docker.com/get-started/'),
('Kubernetes Basics','Interactive tutorials from the Kubernetes docs.','DevOps','Advanced','https://kubernetes.io/docs/tutorials/kubernetes-basics/'),
('Google UX Design Certificate','Structured intro to UX research and design practice.','Design','Beginner','https://grow.google/certificates/ux-design/'),
('Refactoring UI','Practical visual design tactics for developers.','Design','Intermediate','https://www.refactoringui.com/'),
('Roadmap.sh','Community-built role roadmaps for tech careers.','Career','Beginner','https://roadmap.sh/'),
('SQLBolt','Interactive SQL lessons from zero to joins.','Data','Beginner','https://sqlbolt.com/'),
('MIT 18.06 Linear Algebra','Gilbert Strang''s classic lectures and problem sets.','Math','Advanced','https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/');

INSERT INTO public.opportunities (title, description, type, organization, deadline, url, tags) VALUES
('Google Summer of Code','Get paid to contribute to open source with mentorship from real maintainers.','Student Program','Google','2026-04-07','https://summerofcode.withgoogle.com/','{opensource,coding,mentorship}'),
('MLH Global Hack Week','A week of beginner-friendly hackathon events, workshops and prizes.','Hackathon','Major League Hacking','2026-09-01','https://ghw.mlh.io/','{hackathon,beginner,teamwork}'),
('NASA Space Apps Challenge','Global hackathon solving real challenges with open NASA data.','Hackathon','NASA','2026-10-03','https://www.spaceappschallenge.org/','{data,space,hackathon}'),
('Microsoft Student Ambassadors','Build community, get certifications and Azure credits.','Student Program','Microsoft',NULL,'https://mvp.microsoft.com/studentambassadors','{community,cloud,leadership}'),
('Google STEP Internship','Software engineering internship for first and second year students.','Internship','Google','2026-01-31','https://buildyourfuture.withgoogle.com/programs/step','{internship,swe,earlycareer}'),
('Meta Emerging Talent Internship','Engineering internship track for students from underrepresented groups.','Internship','Meta','2026-02-15','https://www.metacareers.com/students','{internship,swe}'),
('Chevening Scholarships','Fully funded master''s study in the UK for future leaders.','Scholarship','UK Government','2026-11-05','https://www.chevening.org/','{scholarship,masters,leadership}'),
('DAAD Study Scholarships','Funding for international students to study in Germany.','Scholarship','DAAD',NULL,'https://www.daad.de/en/','{scholarship,germany}'),
('Kaggle Playground Competition','Monthly beginner-friendly machine learning competitions.','Competition','Kaggle',NULL,'https://www.kaggle.com/competitions','{ml,data,competition}'),
('ICPC Programming Contest','The world''s premier collegiate algorithmic programming contest.','Competition','ICPC',NULL,'https://icpc.global/','{algorithms,competition,teamwork}'),
('Mozilla Open Source Fellowship','Fellowship for people building a healthier internet.','Fellowship','Mozilla',NULL,'https://foundation.mozilla.org/en/what-we-fund/fellowships/','{fellowship,opensource,policy}'),
('CyberStart / Cyber FastTrack','Free cybersecurity challenges and scholarships for students.','Competition','SANS',NULL,'https://www.sans.org/cyber-academy/','{security,ctf,scholarship}');

INSERT INTO public.achievements (code, title, description, icon, xp_reward) VALUES
('profile_completed','Profile Completed','Finished onboarding and set a career goal.','user-check',100),
('first_project','First Project','Added your first portfolio project.','rocket',75),
('project_trio','Builder','Added three portfolio projects.','hammer',150),
('first_certificate','Certified','Added your first certification.','badge-check',75),
('roadmap_explorer','Roadmap Explorer','Completed your first roadmap step.','map',50),
('roadmap_halfway','Halfway There','Completed half of your roadmap.','flag',150),
('opportunity_hunter','Opportunity Hunter','Explored the opportunities hub.','target',50),
('cv_ready','CV Ready','Built a CV with education, skills and projects.','file-text',100);