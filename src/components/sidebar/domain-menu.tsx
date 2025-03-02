import { useDomain } from "@/hooks/sidebar/use-domain";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { PlusCircle, X } from "lucide-react";
//import { Loader } from '../loader'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import UploadButton from "@/components/upload-button";
import FormGenerator, { FormField } from "@/components/forms/form-generator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";


type Props = {
  min?: boolean;
  domains: { id: string; name: string; icon: string | null }[] | null | undefined;
};

const DomainMenu = ({ domains, min }: Props) => {
  const { register, onAddDomain, loading, errors, isDomain, setValue, reset } =
    useDomain();
  const [isOpen, setIsOpen] = useState(false);
  const [iconUrl, setIconUrl] = useState("");
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAddDomain();
      toast({
        title: "Success",
        description: "Domain successfully added",
      });
      setIsOpen(false);
      setIconUrl("");
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add domain",
      });
    }
  };

  useEffect(() => {
    if (iconUrl) {
      setValue("icon", iconUrl);
    }
  }, [iconUrl, setValue]);

  type FormValues = {
    name: string;
    icon: string;
    campaignId?: string;
  };

  const formFields: FormField<FormValues>[] = [
    {
      name: "name",
      label: "Domain Name",
      type: "text",
      placeholder: "e.g., mywebsite.com",
    },
    {
      name: "icon",
      label: "Domain Icon",
      type: "hidden",
    },
  ];

  return (
    <div className={cn("flex flex-col gap-3", min ? "mt-6" : "mt-3")}>
      <div className="flex justify-between w-full items-center">
        {!min && <p className="text-xs text-gray-500">DOMAINS</p>}
        <PlusCircle
          className="cursor-pointer hover:text-gray-600"
          size={25}
          onClick={() => setIsOpen(true)}
        />
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setIconUrl("");
            reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Domain</DialogTitle>
            <p className="text-sm text-gray-500 mt-2">
              Add a domain where you want to integrate your chatbot. This can be
              your existing website or a new site you're planning to build.
            </p>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormGenerator<FormValues>
              fields={[
                {
                  name: "name",
                  label: "Domain Name",
                  type: "text",
                  placeholder: "e.g., mywebsite.com",
                },
                {
                  name: "icon",
                  label: "Domain Icon",
                  type: "hidden",
                },
              ]}
              register={register}
              errors={errors}
            />
            <div className="text-xs text-gray-500">
              Enter the domain name without http:// or https://
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Upload Icon
              </label>
              <UploadButton onUploadComplete={(url) => setIconUrl(url)}>
                {iconUrl ? "Change Icon" : "Upload Icon"}
              </UploadButton>
              {iconUrl && (
                <div className="relative w-12 h-12">
                  <Image
                    src={iconUrl}
                    alt="Domain icon"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setIconUrl("")}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading || !iconUrl}
              className="w-full"
            >
              {loading ? "Adding..." : "Add Domain"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
        {domains?.map((domain) => (
          <Link
            key={domain.id}
            href={`/domains/${domain.name}`}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100",
              isDomain === domain.name && "bg-gray-100 font-medium",
              min && "justify-center"
            )}
          >
            {domain.icon && (
              <div className="relative w-5 h-5">
                <Image
                  src={domain.icon}
                  alt={domain.name}
                  fill
                  className="object-cover rounded-sm"
                />
              </div>
            )}
            {!min && <span className="text-sm">{domain.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DomainMenu;

// Arslan's code
// const DomainMenu = ({ domains, min }: Props) => {
//   const { register, onAddDomain, loading, errors, isDomain } = useDomain();

//   console.log(domains)

//   return (
//     <div className={cn("flex flex-col gap-3", min ? "mt-6" : "mt-3")}>
//       {/* TODO: Header with Add Domain Button */}
//       <div className="flex justify-between w-full items-center">
//         {!min && <p className="text-xs text-gray-500">DOMAINS</p>}
//         <AppDrawer
//         description="Add your domain address to integrate your charbot"
//         title="Add your business domain"
//         onOpen={
//           <PlusCircle className="cursor-pointer text-ironside" size={25}/>
//         }
//       >
//         <Loader loading={loading}>
//           <form 
//           className="mt-3 w-6/12 flex flex-col gap-3"
//           onSubmit={onAddDomain}
//         >
//           <FormGenerator
//            inputType="input"
//            register={register}
//            label="Domain"
//            name="domain"
//            errors={errors}
//            placeholder="mydomain.com"
//            type="text"
//           />
//           <UploadButton
//           register={register}
//           label="Upload Icon"
//           errors={errors}
//           />
//           <Button
//           type="submit"
//           className="w-full"
//           >
//             Add Domain
//           </Button>
//         </form>
//         </Loader>
//       </AppDrawer>    
//       </div>
//       <div className="flex flex-col gap-1 text-ironside font-medium">
//         {domains && 
//         domains.map((domain) => (
//           <Link
//           href={`/settings/${domain.name.split('.')[0]}`}
//           key={domain.id}
//           className={cn(
//             'flex gap-3 hover:bg-white rounded-full transition duration-100 ease-in-out cursor-pointer',
//             !min ? 'p-2' : 'py-2',
//             domain.name.split('.')[0] == isDomain && 'bg-white'
//           )}
//           >
//             <Image
//             src={`https://ucarecdn.com/${domain.icon}/`}
//             alt="logo"
//             width={20}
//             height={20}
//             />
//             {!min && <p className="text-sm">{domain.name}</p>}
//             </Link>
//         ))}
//     </div>
//    </div>
//   )
// }

// export default DomainMenu;
//


// my code
// type Props = {
//   min?: boolean;
//   domains: { id: string; name: string; icon: string | null }[] | null | undefined;
// };

// const DomainMenu = ({ domains, min }: Props) => {
//   const { register, onAddDomain, loading, errors, isDomain } = useDomain();
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const form = useForm<AddDomainSchemaType>({
//     resolver: zodResolver(AddDomainSchema),
//     defaultValues: {
//       domainName: "",
//       icon: null,
//     },
//   });

//   const handleModalOpen = () => setIsModalOpen(true);
//   const handleModalClose = () => setIsModalOpen(false);

//   return (
//     <div className={cn("flex flex-col gap-3", min ? "mt-6" : "mt-3")}>
//       {/* Header with Add Domain Button */}
//       <div className="flex justify-between w-full items-center">
//         {!min && <p className="text-xs text-gray-500">DOMAINS</p>}
//         <PlusCircle className="cursor-pointer" size={25} onClick={handleModalOpen} />
//       </div>

//       {/* Modal for Adding New Domain */}
//       <Modal isOpen={isModalOpen} onClose={handleModalClose}>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onAddDomain)} className="space-y-4">
//             <FormField
//               name="domainName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Domain Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter domain name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               name="icon"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Domain Icon</FormLabel>
//                   <FormControl>
//                     <Input type="file" accept="image/*" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" disabled={loading}>
//               {loading ? "Adding..." : "Add Domain"}
//             </Button>
//           </form>
//         </Form>
//       </Modal>

//       {/* Render Existing Domains */}
//       <div className="flex flex-col gap-2">
//         {domains?.map((domain) => (
//           <Link key={domain.id} href={`/domains/${domain.id}`}>
//             <a
//               className={cn(
//                 "flex items-center gap-2 p-2 rounded-md",
//                 isDomain === domain.id ? "bg-gray-200" : "hover:bg-gray-100"
//               )}
//             >
//               {domain.icon ? (
//                 <Image src={domain.icon} alt={domain.name} width={24} height={24} className="rounded-full" />
//               ) : (
//                 <div className="w-6 h-6 bg-gray-300 rounded-full" />
//               )}
//               {!min && <span>{domain.name}</span>}
//             </a>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DomainMenu;
