import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { LeftBar } from "../components/LeftBar";
import { RightBar } from "../components/RightBar";
import { GemSvg, LessonTopBarHeart } from "../components/Svgs";
import { buyHeart, getCurrentUser } from "../services/Users/userService";

function Shop() {
  const heartPrice = 10; // giá cứng cho 1 trái tim
  const maxHearts = 5;
  const [loading, setLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [heartsCount, setHeartsCount] = useState(0);

  // Fetch số hearts hiện tại mỗi khi mount hoặc refreshCount thay đổi
  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res.code === 0) {
          setHeartsCount(res.data.hearts_count || 0);
        }
      })
      .catch(console.error);
  }, [refreshCount]);

  const isMaxHearts = heartsCount >= maxHearts;

  const handleBuyHeart = async () => {
    if (isMaxHearts) {
      return toast.warn(`Bạn đã có đủ ${maxHearts} trái tim rồi.`);
    }
    setLoading(true);
    try {
      const res = await buyHeart({ quantity: 1 });
      if (res.code === 0) {
        toast.success("Mua trái tim thành công!", {
          onClose: () => setRefreshCount((c) => c + 1),
        });
      } else {
        toast.error(res.message || "Không đủ lingots");
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi mua trái tim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LeftBar selectedTab="Shop" />
      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="px-4 pb-20">
          <div className="py-7">
            <h2 className="mb-5 text-2xl font-bold">Power-ups</h2>
            {/* Hearts section */}
            <div className="flex items-start gap-4 border-t-2 border-gray-300 py-5">
              <LessonTopBarHeart className="w-24 h-24 text-red-500" />
              <section className="flex flex-col gap-3">
                <h3 className="text-lg font-bold">Hearts</h3>
                <p className="text-sm text-gray-500">
                  Purchase hearts to keep practicing even after making mistakes.
                </p>
                <button
                  onClick={handleBuyHeart}
                  disabled={loading || isMaxHearts}
                  className="flex w-fit items-center gap-1 rounded-2xl border-2 border-gray-300 bg-white px-4 py-2 text-sm font-bold uppercase text-gray-700 cursor-pointer transition duration-150 ease-in-out hover:bg-gray-100 hover:border-gray-400 active:scale-95 active:bg-gray-200 disabled:opacity-50"
                >
                  {isMaxHearts ? (
                    "Đã đủ trái tim"
                  ) : loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <GemSvg /> {heartPrice}
                    </>
                  )}
                </button>
              </section>
            </div>
          </div>
        </div>
        <RightBar refreshCount={refreshCount} />
      </div>
    </>
  );
}

export default Shop;
