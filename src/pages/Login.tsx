// react
import { IonContent } from "@ionic/react";

// Assets
import fallgirl from "../assets/FallGirl.png";

// Dependencies
import { useNavigate } from "react-router";
import { useUserStore } from "../lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// DB
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Componentes
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useUserStorage } from "@/useHook/useUserStorage";

// type
const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Por favar digite seu email.",
    })
    .email({
      message: "Insira email valido.",
    }),
  senha: z.string().min(6, {
    message: "Senha deve conter no mínimo 6 caracteres.",
  }),
});

export default function Login() {
  //storage
  const { updateUserStorage } = useUserStorage();
  const { updateUser } = useUserStore();

  // form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  // react router
  const navigate = useNavigate();

  //functions

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values)
    await signInWithEmailAndPassword(auth, values.email, values.senha)
      .then(async (userCredential) => {
        const user = userCredential.user;
        updateUser(user);
        await updateUserStorage(user.toJSON());
        navigate("/base");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }

  return (
    <IonContent>
      <div className="flex flex-col flex-1 items-center px-10 h-full justify-center sm:grid sm:grid-cols-2">
        <div className="flex flex-col">
          <img src={fallgirl} className="w-[800px] " alt="fall" />
        </div>

        <div className="flex flex-col w-full py-10 ">
          <div className="flex flex-col pb-7 w-full">
            <p className="font-title font-semibold text-[#2A416F] text-[30px] leading-tight">
              Olá,
            </p>
            <p className="font-title font-semibold text-[#2A416F] text-[30px]  leading-tight">
              Hora do Login!
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Email</FormLabel> */}
                    <FormControl>
                      <Input
                        placeholder="albert.einstain@etec.sp.gov.br"
                        className="bg-[#EFEFEF] focus:bg-[#fff] rounded-[14px] mb-0 p-4 shadow-md text-lg w-full border-0 focus:border-2 border-transparent focus:border-[#4a92ff] text-gray-500 focus:text-black placeholder-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Senha</FormLabel> */}
                    <FormControl>
                      <Input
                        placeholder="******"
                        type="password"
                        className="bg-[#EFEFEF] focus:bg-[#fff] rounded-[14px] mb-0 p-4 shadow-md text-lg w-full border-0 focus:border-2 border-transparent focus:border-[#4a92ff] text-gray-500 focus:text-black placeholder-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full text-center rounded-[18px] bg-[#4A92FF] py-7 text-white font-medium text-[21px]"
              >
                Login
              </Button>
            </form>
          </Form>
          <Link
            to={"/../register"}
            className="w-full text-center rounded-[20px] py-6 text-[#000] font-medium text-[18px]"
          >
            Não Possui Conta? Registrar
          </Link>
        </div>
      </div>
    </IonContent>
  );
}
