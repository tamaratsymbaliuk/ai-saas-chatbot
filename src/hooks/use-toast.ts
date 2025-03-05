import { toast } from "sonner";

export const useToast = () => {
  return {
    toast: ({ title, description }: { title: string; description: string }) => {
      toast(title, {
        description,
      });
    },
  };
};

/*import { toast } from "react-hot-toast";


export const useToast = () => {
  return { toast };
};*/