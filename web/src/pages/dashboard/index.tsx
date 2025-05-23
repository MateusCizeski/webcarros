import { useEffect, useState, useContext } from 'react';
import { Container } from '../../components/container';
import { DashboardHeader } from '../../components/panelHeader';
import { FiTrash2 } from 'react-icons/fi';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, storage } from '../../services/firebaseConnection';
import { AuthContext } from '../../context/AuthContext';
import { deleteObject, ref } from 'firebase/storage';

interface CarsProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string;
  images: CarImageProps[];
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export default function Dashboard() {
  const [cars, setCars] = useState<CarsProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    function loadCars() {
      if (!user?.uid) return;

      const carsRef = collection(db, 'cars');
      const queryRef = query(carsRef, where('uid', '==', user.uid));

      getDocs(queryRef).then((snapshot) => {
        let listcars = [] as CarsProps[];

        snapshot.forEach((doc) => {
          listcars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            uid: doc.data().uid,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
          });
        });

        setCars(listcars);
      });
    }

    loadCars();
  }, [user]);

  async function handleDeleteCar(car: CarsProps) {
    const docRef = doc(db, 'cars', car.id);
    await deleteDoc(docRef);

    car.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;
      const imageRef = ref(storage, imagePath);

      try {
        await deleteObject(imageRef);
        setCars(cars.filter((car) => car.id !== car.id));
      } catch (err) {
        console.log('Erro ao excluir essa imagem');
      }
    });
  }

  return (
    <Container>
      <DashboardHeader />

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <section key={car.id} className="w-full bg-white rounded-lg relative">
            <button
              onClick={() => handleDeleteCar(car)}
              className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2"
            >
              <FiTrash2 size={26} color="#000" />
            </button>
            <img
              className="w-full rounded-lg mb-2 max-h-70"
              src={car.images[0].url}
            />
            <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700">
                Ano {car.year}| {car.km} KM
              </span>
              <strong className="text-black font-bold mt-4">{car.price}</strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2">
              <div className="px-2 pb-2">
                <span className="text-black">{car.city}</span>
              </div>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}
