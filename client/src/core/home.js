import '../App.css';
// Helpery
import Title from '../helpers/title';
import Footer from '../helpers/footer';
// Komponenty
import Dashboard from '../components/dashboard';
// Konstanty
const stations = ['8e22134e5fa571f536412ed5647e63e1'];

const Home = () => {

    return (
        <>
            <Title title='Domovská stránka' />
            <div className='container'>
                <div className='card border-0 shadow my-5'>
                    <div className='card-body p-5'>
                        <h1> <u> Dashboard </u> </h1>
                        <div className='new-line'></div>
                        <Dashboard public_tokens={stations} />
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
};

export default Home;