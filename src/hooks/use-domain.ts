"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddDomainSchema, AddDomainInput } from "@/schemas/settings.schema";
import { onIntegrateDomain } from "@/actions/settings";
import { useToast } from "@/hooks/use-toast";

type DomainResponse = {
  status: number;
  message: string;
  domain?: {
    id: string;
    name: string;
    icon: string;
  };
};

export const useDomain = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddDomainInput>({
    resolver: zodResolver(AddDomainSchema),
  });

  const pathname = usePathname();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDomain, setIsDomain] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    setIsDomain(pathname.split("/").pop());
  }, [pathname]);

  const onSubmit = async (data: AddDomainInput): Promise<DomainResponse> => {
    const response = await onIntegrateDomain(
      data.campaignId || "",
      data.name,
      data.icon
    );

    if (response.status === 200) {
      reset();
      router.refresh();
    }

    return response as DomainResponse;
  };

  const onAddDomain = async (e?: React.FormEvent): Promise<DomainResponse> => {
    if (e) {
      e.preventDefault();
    }
    setLoading(true);

    try {
      let response: DomainResponse = {
        status: 500,
        message: "Something went wrong",
      };

      await handleSubmit(async (data) => {
        response = await onSubmit(data);
      })();

      return response;
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message: "Something went wrong",
      };
    } finally {
      setLoading(false);
    }
  };

  return { register, onAddDomain, errors, loading, isDomain, setValue, reset };
};
// "use client";

// import { useState, useEffect } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { AddDomainSchema, AddDomainInput } from "@/schemas/settings.schema";
// import { onIntegrateDomain } from "@/actions/settings";
// import { useToast } from "@/hooks/use-toast";
// import { UploadClient } from "@uploadcare/upload-client";
// import { uploadFile } from '@uploadcare/upload-client'

// type DomainResponse = {
//   status: number;
//   message: string;
//   domain?: {
//     id: string;
//     name: string;
//     icon: string;
//   };
// };

// const upload = new UploadClient({
//   publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string
// });



// export const useDomain = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//   } = useForm<AddDomainInput>({
//     resolver: zodResolver(AddDomainSchema),
//   });

//   const pathname = usePathname();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isDomain, setIsDomain] = useState<string | undefined>(undefined);
//   const router = useRouter();

//   useEffect(() => {
//     setIsDomain(pathname.split("/").pop());
//   }, [pathname]);

//   const onSubmit = async (data: AddDomainInput): Promise<DomainResponse> => {
//     const response = await onIntegrateDomain(
//       data.name,
//       data.icon
//     );

//     if (response.status === 200) {
//       reset();
//       router.refresh();
//     }

//     return response as DomainResponse;
//   };

//   const onAddDomain = async (e?: React.FormEvent): Promise<DomainResponse> => {
//     if (e) {
//       e.preventDefault();
//     }
//     setLoading(true);

//     try {
//       let response: DomainResponse = {
//         status: 500,
//         message: "Something went wrong",
//       };

//       await handleSubmit(async (data) => {
//         // Check if an icon file is selected
//         if (data.icon) {
//           const uploadClient = new UploadClient({
//             publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string,
//           });

//           // Upload the icon file to Uploadcare
//           const uploadResult = await uploadClient.uploadFile(data.icon);

//           // Update the icon field with the uploaded file URL
//           data.icon = uploadResult.cdnUrl;
//         }

//         response = await onSubmit(data);
//       })();

//       return response;
//     } catch (error) {
//       console.error(error);
//       return {
//         status: 500,
//         message: "Something went wrong",
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { register, onAddDomain, errors, loading, isDomain, setValue, reset };
// };
// Arslan's code
// import { onIntegrateDomain } from "@/actions/settings";
// import { useToast } from '@/hooks/use-toast'
// import { AddDomainSchema } from "@/schemas/settings.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { UploadClient } from '@uploadcare/upload-client'
// import { usePathname, useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { FieldValues, useForm } from "react-hook-form";

// const upload = new UploadClient({
//   publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string
// });

// export const useDomain = () => {
//   const { register, handleSubmit, formState: { errors }, reset } = useForm<FieldValues>({
//     resolver: zodResolver(AddDomainSchema), // Validate form with Zod
//   });

//   const pathname = usePathname();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isDomain, setIsDomain] = useState<string | undefined>(undefined);
//   const router = useRouter();

//   useEffect(() => {
//     setIsDomain(pathname.split("/").pop()); // Extract domain from URL
//   }, [pathname]);

//   const onAddDomain = handleSubmit(async (values: FieldValues) => {
//     setLoading(true);
//     const uploaded = await upload.uploadFile(values.image[0])
//     const domain = await onIntegrateDomain(values.domain, uploaded.uuid)
//     if (domain) {
//         reset()
//         setLoading(false)
//         toast({
//             title: domain.status == 200 ? 'Success' : 'Error',
//             description: domain.message,
//         })
//         router.refresh()
//     }
// })

// return { register, onAddDomain, errors, loading, isDomain };

// }





