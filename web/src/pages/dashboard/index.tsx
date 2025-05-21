import { useEffect, useState, useContext } from 'react';
import { Container } from '../../components/container';
import { DashboardHeader } from '../../components/panelHeader';
import { FiTrash2 } from 'react-icons/fi';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { AuthContext } from '../../context/AuthContext';

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

  return (
    <Container>
      <DashboardHeader />

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <section className="w-full bg-white rounded-lg relative">
          <button
            onClick={() => {}}
            className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2"
          >
            <FiTrash2 size={26} color="#000" />
          </button>
          <img className="w-full rounded-lg mb-2 max-h-70" src="" />
          <p className="font-bold mt-1 px-2 mb-2"></p>

          <div className="flex flex-col px-2">
            <span className="text-zinc-700"></span>
            <strong className="text-black font-bold mt-4"></strong>
          </div>

          <div className="w-full h-px bg-slate-200 my-2">
            <div className="px-2 pb-2">
              <span className="text-black"></span>
            </div>
          </div>
        </section>
      </main>
    </Container>
  );
}
