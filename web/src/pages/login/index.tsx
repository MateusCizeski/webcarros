import logoImg from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { Container } from '../../container';
import { Input } from '../../components/input';

export default function Login() {
    return (
      <Container>
        <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
          <Link to='/' className='mb-6 max-w-sm w-full'>
            <img 
              src={logoImg} 
              alt="Logo do site" 
              className='w-full'
              />
          </Link>
          
          <form className='bg-white max-w-xl w-full rounded-lg'>
            <Input 
              type= "email"
              placeholder= "digite seu email"
              name= "email"
            />
          </form>
        </div>
      </Container>
    )
}
  