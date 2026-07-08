import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/auth";
import { LoginRequest } from "./models";
import logger from "@/lib/logger";

export function useLogin() {
    return useMutation({
        mutationFn: (req: LoginRequest) => login(req),
        onSuccess: (data) => {
            logger.info("Login successful", { email: data.email });
        },
    });
}
