import { tsr } from "@/lib/api-client";

export const useAuthActions = () => {
  const queryClient = tsr.useQueryClient();
  const loginMutation = tsr.auth.login.useMutation({
    mutationKey: ["auth", "login"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    },
  });

  const registerMutation = tsr.auth.register.useMutation({
    mutationKey: ["auth", "register"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    },
  });

  return { loginMutation, registerMutation };
};

// export const useRegisterMutation = () => {
//   const queryClient = tsr.useQueryClient();
//   return
// tsr.auth.register.useMutation({
//     mutationKey: ["auth", "register"],
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["getUser"] });
//     },
//   });
// };
