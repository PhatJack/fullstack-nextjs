import { tsr } from "@/lib/api-client";

export const useLoginMutation = () => {
  return tsr.auth.login.useMutation({
    mutationKey: ["auth", "login-mutaion"],
    onSuccess: () => {
      tsr.useQueryClient().invalidateQueries({ queryKey: ["getUser"] });
    },
  });
};
