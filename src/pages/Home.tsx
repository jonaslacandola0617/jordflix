import useLatest from "@/features/home/useLatest";

function Home() {
  const { data: latest } = useLatest();

  return <div>Home</div>;
}

export default Home;
