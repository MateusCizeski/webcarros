import { Container } from '../../../components/container';
import { DashboardHeader } from '../../../components/panelHeader';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiUpload, FiTrash } from 'react-icons/fi';
import { ChangeEvent, useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { v4 as uuidV4 } from 'uuid';
import { storage, db } from '../../../services/firebaseConnection';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

const schema = z.object({
  name: z.string().nonempty('Este campo é obrigatório'),
  model: z.string().nonempty('Este campo é obrigatório'),
  year: z.string().nonempty('Este campo é obrigatório'),
  km: z.string().nonempty('Este campo é obrigatório'),
  price: z.string().nonempty('Este campo é obrigatório'),
  city: z.string().nonempty('Este campo é obrigatório'),
  whatsapp: z
    .string()
    .min(1, 'Este campo é obrigatório')
    .refine((value) => /^(\d{10, 11})$/.test(value), {
      message: 'Número de telefne inválido',
    }),
  description: z.string().nonempty('Este campo é obrigatório'),
});

interface ImageItemProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

type FormData = z.infer<typeof schema>;

export default function New() {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const [carImages, setCarImages] = useState<ImageItemProps[]>([]);

  function onSubmit(data: FormData) {
    if (!carImages.length) {
      alert('Envia agumas imagens para cadastrar');
      return;
    }

    const carListImages = carImages.map((car) => {
      return {
        uid: car.uid,
        name: car.name,
        url: car.url,
      };
    });

    addDoc(collection(db, 'cars'), {
      name: data.name,
      model: data.model,
      year: data.year,
      km: data.km,
      price: data.price,
      city: data.city,
      whatsapp: data.whatsapp,
      description: data.description,
      owner: user?.name,
      uid: user?.uid,
      images: carListImages,
    })
      .then(() => {
        reset();
        setCarImages([]);
        console.log('sucesso ao cadastrar.');
      })
      .catch((error) => {
        console.log(error);
        console.log('erro ao cadastrar carro');
      });
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === 'image/jpeg' || image.type === 'image/png') {
        handleUpload(image);
      } else {
        alert('envie uma imagem JPEG ou PNG');
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) return;

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);
    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downloadUrl,
        };

        setCarImages((images) => [...images, imageItem]);
      });
    });
  }

  async function handleDeleteImage(item: ImageItemProps) {
    const imagePath = `images${item.uid}/${item.name}`;
    const imageRef = ref(storage, imagePath);

    try {
      await deleteObject(imageRef);
      setCarImages(carImages.filter((car) => car.url !== item.url));
    } catch (err) {
      console.log('Erro ao deletar', err);
    }
  }

  return (
    <Container>
      <DashboardHeader />

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </button>

        {carImages.map((item) => (
          <div
            key={item.name}
            className="w-full h-32 flex items-center justify-center relative"
          >
            <button
              className="absolute"
              onClick={() => handleDeleteImage(item)}
            >
              <FiTrash size={28} color="#FFF" />
            </button>
            <img
              src={item.previewUrl}
              className="rounded-lg w-full h-32 object-cover"
              alt="Foto do carro"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do carro</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Onix 1.0..."
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo do carro</p>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex: 1.0 flex manual"
            />
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano</p>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ex: 2016/2016"
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Km rodados</p>
              <Input
                type="text"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Ex: 23.900..."
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone / Whatsapp</p>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex: 011991024"
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">cidade</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: Campo grande - MS"
              />
            </div>
          </div>

          <div className="w-full">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Ex: 69.000"
            />
          </div>

          <div className="w-full">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register('description')}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro..."
            />
            {errors.description && (
              <p className="bb-1 text-red-500">{errors.description?.message}</p>
            )}

            <button
              type="submit"
              className="w-full h-10 rounded-md bg-zinc-900 text-white font-medium"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}
