import '../App.css';
// Helpery
import Title from '../helpers/title';
import Footer from '../helpers/footer';
// Komponenty
import Dashboard from '../components/dashboard';

const Home = () => {

    return (
        <>
            <Title title='Domovská stránka' />
            <div className='container'>
                <div className='card border-0 shadow my-5'>
                    <div className='card-body p-5'>
                        <h1> <u> Dashboard </u> </h1>
                        <div className='new-line'></div>
                        <Dashboard public_tokens={['cbKwZmB1Ez1RA']} />
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
};

export default Home;