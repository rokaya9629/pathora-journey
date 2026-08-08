import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Opportunity } from "@/hooks/usePathora";

export function useOpportunitiesFull() {
  return useQuery({
    queryKey: ["opportunities_full"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("deadline", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as Opportunity[];
    },
  });
}

export function useSavedOpportunities(userId: string | undefined) {
  return useQuery({
    queryKey: ["saved_opportunities", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_opportunities")
        .select("id, opportunity_id, created_at")
        .eq("user_id", userId!);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useToggleSaved(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ opportunityId, saved }: { opportunityId: string; saved: boolean }) => {
      if (!userId) throw new Error("You need to be signed in to bookmark opportunities.");
      if (saved) {
        const { error } = await supabase
          .from("saved_opportunities")
          .delete()
          .eq("user_id", userId)
          .eq("opportunity_id", opportunityId);
        if (error) throw error;
        return { saved: false };
      }
      const { error } = await supabase
        .from("saved_opportunities")
        .insert({ user_id: userId, opportunity_id: opportunityId });
      if (error) throw error;
      return { saved: true };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["saved_opportunities", userId] });
    },
  });
}
