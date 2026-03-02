import Carousel from "./Carousel";
import "./styles/index.css";

const slides = [
  {
    id: 1,
    title: "Slide 1",
    image: "https://picsum.photos/id/1015/300/300",
    landing_page: "https://landingpage1",
  },
  {
    id: 2,
    title: "Slide 2",
    image: "https://picsum.photos/id/1016/300/300",
    landing_page: "https://landingpage2",
  },
  {
    id: 3,
    title: "Slide 3",
    image: "https://picsum.photos/id/1018/300/300",
    landing_page: "https://landingpage3",
  },
  {
    id: 4,
    title: "Slide 4",
    image: "https://picsum.photos/id/1019/300/300",
    landing_page: "https://landingpage4",
  },
  {
    id: 5,
    title: "Slide 5",
    image: "https://picsum.photos/id/1020/300/300",
    landing_page: "https://landingpage5",
  },
  {
    id: 6,
    title: "Slide 6",
    image: "https://picsum.photos/id/1021/300/300",
    landing_page: "https://landingpage6",
  },
];

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <Carousel slides={slides} autoplay />
    </div>
  );
}

export default App;
