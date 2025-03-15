import { LeftBar } from "../components/LeftBar";
import { RightBar } from "../components/RightBar";

const Learn = () => {
  return (
    <>
     <LeftBar selectedTab="Learn" />
     <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
      <div className="flex max-w-2xl grow flex-col"></div>
   
        <RightBar />
      </div>
    </>

    
  );
};
export default Learn;
