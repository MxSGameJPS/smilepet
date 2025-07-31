import Header from "../components/Header/header";
import Hero from "../components/Hero/hero";
import FeaturedProducts from "../components/FeaturedProducts/featuredProducts";
import PlanoAssinatura from "../components/PlanoAssinatura/planoAssinatura";
import Promocoes from "../components/Promocoes/promocoes";
import Footer from "../components/Footer/footer";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <FeaturedProducts />
      <PlanoAssinatura />
      <Promocoes />
      <Footer />
    </div>
  );
}
