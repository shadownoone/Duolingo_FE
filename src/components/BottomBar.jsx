import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const useBottomBarItems = () => {
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  const learnHref = currentLanguage?.language_id
    ? `/learn/${currentLanguage.language_id}`
    : "/languageList";
  const loggedIn = true;
  const bottomBarItems = [
    {
      name: "Learn",
      href: learnHref,
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="h-[50px] w-[50px]"
        >
          <path
            d="M24.5852 25.2658C24.2883 26.8243 22.9257 27.9519 21.3392 27.9519H10.6401C9.05354 27.9519 7.69094 26.8243 7.39408 25.2658L4.98096 12.5969L15.9001 4.52225L26.9988 12.5941L24.5852 25.2658Z"
            fill="#FFC800"
          />
          <path
            opacity="0.5"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.1558 23.1111C13.1558 22.522 13.6333 22.0444 14.2224 22.0444H18.4891C19.0782 22.0444 19.5558 22.522 19.5558 23.1111C19.5558 23.7002 19.0782 24.1778 18.4891 24.1778H14.2224C13.6333 24.1778 13.1558 23.7002 13.1558 23.1111Z"
            fill="#945151"
          />
          <path
            d="M19.4785 16.2998C19.4785 18.2208 17.9212 19.778 16.0002 19.778C14.0792 19.778 12.522 18.2208 12.522 16.2998C12.522 14.3788 14.0792 12.8215 16.0002 12.8215C17.9212 12.8215 19.4785 14.3788 19.4785 16.2998Z"
            fill="#945151"
          />
          <path
            d="M16.1685 2.84462C16.6431 2.84231 17.1233 2.98589 17.5361 3.28558L17.5368 3.2861L29.9455 12.2319C30.9781 12.9822 31.207 14.4275 30.4568 15.4601C29.7067 16.4924 28.262 16.7215 27.2294 15.9719L27.2286 15.9714L16.1602 7.99185L5.09208 15.9712L5.09121 15.9719C4.05865 16.7213 2.61395 16.4923 1.86391 15.4599C1.11367 14.4273 1.34258 12.982 2.3752 12.2318L2.37679 12.2306L14.7839 3.28596L14.7846 3.28544C15.2022 2.98229 15.6887 2.83889 16.1685 2.84462Z"
            fill="#FF4B4B"
          />
        </svg>
      ),
    },
    {
      name: "Shop",
      href: "/shop",
      icon: (
        <svg
          width="46"
          height="46"
          viewBox="0 0 46 46"
          fill="none"
          className="h-[50px] w-[50px]"
        >
          <path
            d="M40 36V17H6V36C6 38.2091 7.73969 40 9.88571 40H36.1143C38.2603 40 40 38.2091 40 36Z"
            fill="#A56644"
          />
          <path d="M4 10C4 7.79086 5.79086 6 8 6H17V17H4V10Z" fill="#EA2B2B" />
          <path
            d="M4 17H17V17.5C17 21.0899 14.0899 24 10.5 24C6.91015 24 4 21.0899 4 17.5V17Z"
            fill="#FF4945"
          />
          <path
            d="M17 17H29V17.5C29 21.0899 26.3137 24 23 24C19.6863 24 17 21.0899 17 17.5V17Z"
            fill="white"
          />
          <path
            d="M29 17H42V17.5C42 21.0899 39.0899 24 35.5 24C31.9101 24 29 21.0899 29 17.5V17Z"
            fill="#FF4945"
          />
          <path d="M17 6H29V17H17V6Z" fill="#D0D0D0" />
          <path
            d="M29 6H38C40.2091 6 42 7.79086 42 10V17H29V6Z"
            fill="#EA2B2B"
          />
          <path
            d="M11 30C11 28.8954 11.8954 28 13 28H18C19.1046 28 20 28.8954 20 30V40H11V30Z"
            fill="#B9E8FF"
          />
          <path
            d="M24 30C24 28.8954 24.8954 28 26 28H34C35.1046 28 36 28.8954 36 30V34C36 35.1046 35.1046 36 34 36H26C24.8954 36 24 35.1046 24 34V30Z"
            fill="#B9E8FF"
          />
        </svg>
      ),
    },
    {
      name: "Profile",
      href: "/profile",
      icon: (
        <svg
          width="46"
          height="46"
          viewBox="0 0 46 46"
          fill="none"
          className="h-[50px] w-[50px]"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M23.1826 5.00195C14.3461 5.00195 7.18262 12.1654 7.18262 21.002V21.9375C4.21918 23.4102 2.18262 26.4682 2.18262 30.002C2.18262 34.9725 6.21206 39.002 11.1826 39.002H35.1826C40.1532 39.002 44.1826 34.9725 44.1826 30.002C44.1826 26.4682 42.1461 23.4102 39.1826 21.9375V21.002C39.1826 12.1654 32.0192 5.00195 23.1826 5.00195Z"
            fill="#9069CD"
          />
          <path
            d="M11.1826 21.002C11.1826 14.3745 16.5552 9.00195 23.1826 9.00195C29.81 9.00195 35.1826 14.3745 35.1826 21.002V29.002C35.1826 35.6294 29.81 41.002 23.1826 41.002C16.5552 41.002 11.1826 35.6294 11.1826 29.002V21.002Z"
            fill="#F3AD6D"
          />
          <path
            d="M7.18262 24.502C7.18262 22.0167 9.19734 20.002 11.6826 20.002H34.6826C37.1679 20.002 39.1826 22.0167 39.1826 24.502C39.1826 26.9872 37.1679 29.002 34.6826 29.002H11.6826C9.19734 29.002 7.18262 26.9872 7.18262 24.502Z"
            fill="#F3AD6D"
          />
          <path
            d="M18.1826 20.502C18.1826 19.6735 18.8542 19.002 19.6826 19.002C20.511 19.002 21.1826 19.6735 21.1826 20.502V24.502C21.1826 25.3304 20.511 26.002 19.6826 26.002C18.8542 26.002 18.1826 25.3304 18.1826 24.502V20.502Z"
            fill="#BF8034"
          />
          <path
            d="M24.1826 20.502C24.1826 19.6735 24.8542 19.002 25.6826 19.002C26.511 19.002 27.1826 19.6735 27.1826 20.502V24.502C27.1826 25.3304 26.511 26.002 25.6826 26.002C24.8542 26.002 24.1826 25.3304 24.1826 24.502V20.502Z"
            fill="#BF8034"
          />
          <path
            d="M17.1826 29.0445C17.1826 28.4687 17.6494 28.002 18.2252 28.002H27.1401C27.7159 28.002 28.1826 28.4687 28.1826 29.0445V29.502C28.1826 32.5395 25.7202 35.002 22.6826 35.002C19.6451 35.002 17.1826 32.5395 17.1826 29.502V29.0445Z"
            fill="white"
          />
          <path
            d="M7.18262 21.0062V21.002C7.18262 12.1654 14.3461 5.00195 23.1826 5.00195C26.0199 5.00195 28.6847 5.74049 30.9953 7.0358C29.7326 15.5 22.2386 22.002 13.1826 22.002C11.0788 22.002 9.05929 21.6511 7.18262 21.0062Z"
            fill="#9069CD"
          />
        </svg>
      ),
    },
    {
      name: "Vocabulary",
      href: "/vocabulary",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="46"
          height="46"
          viewBox="0 0 46 46"
          fill="none"
          className="mdl-js"
        >
          <g clip-path="url(#clip0)">
            <line
              x1="18.4199"
              y1="25.0669"
              x2="27.0802"
              y2="20.0669"
              stroke="#AFAFAF"
              strokeWidth="3"
            />
            <rect
              x="19.9639"
              y="9.7417"
              width="9"
              height="26"
              rx="4.5"
              transform="rotate(-30 19.9639 9.7417)"
              fill="#1CB0F6"
            />
            <rect
              x="5.24219"
              y="18.2417"
              width="9"
              height="26"
              rx="4.5"
              transform="rotate(-30 5.24219 18.2417)"
              fill="#1CB0F6"
            />
            <rect
              x="28.0264"
              y="9.70581"
              width="9"
              height="18"
              rx="4.5"
              transform="rotate(-30 28.0264 9.70581)"
              fill="#1CB0F6"
            />
            <rect
              x="1.17969"
              y="25.2058"
              width="9"
              height="18"
              rx="4.5"
              transform="rotate(-30 1.17969 25.2058)"
              fill="#1CB0F6"
            />
            <rect
              opacity="0.3"
              x="5.17969"
              y="26.2058"
              width="3"
              height="5"
              rx="1.5"
              transform="rotate(-30 5.17969 26.2058)"
              fill="white"
            />
            <rect
              opacity="0.3"
              x="33.1797"
              y="11.2058"
              width="3"
              height="5"
              rx="1.5"
              transform="rotate(-30 33.1797 11.2058)"
              fill="white"
            />
            <rect
              opacity="0.3"
              x="9.17969"
              y="19.2058"
              width="3"
              height="6"
              rx="1.5"
              transform="rotate(-30 9.17969 19.2058)"
              fill="white"
            />
            <rect
              opacity="0.3"
              x="24.1797"
              y="11.2058"
              width="3"
              height="6"
              rx="1.5"
              transform="rotate(-30 24.1797 11.2058)"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="46" height="46" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
  ];

  if (loggedIn) {
    bottomBarItems.splice(1, 0, {
      name: "Leaderboards",
      href: "/leaderboard",
      icon: (
        <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
          <path
            d="M7 9.5C7 7.84314 8.34315 6.5 10 6.5H36C37.6569 6.5 39 7.84315 39 9.5V23.5C39 32.3366 31.8366 39.5 23 39.5C14.1634 39.5 7 32.3366 7 23.5V9.5Z"
            fill="#FEC701"
          />
          <path
            opacity="0.3"
            d="M39.0001 13.3455V9.5C39.0001 7.84315 37.657 6.5 36.0001 6.5H31.5706L8.30957 29.8497C9.68623 33.0304 12.0656 35.6759 15.0491 37.3877L39.0001 13.3455Z"
            fill="white"
          />
        </svg>
      ),
    });
  }

  return bottomBarItems;
};

export const BottomBar = ({ selectedTab }) => {
  const bottomBarItems = useBottomBarItems();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t-2 border-[#e5e5e5] bg-white md:hidden">
      <ul className="flex h-[88px]">
        {bottomBarItems.map((item) => (
          <li
            key={item.href}
            className="flex flex-1 items-center justify-center"
          >
            <Link
              to={item.href}
              className={
                item.name === selectedTab
                  ? "rounded-xl border-2 border-[#84d8ff] bg-[#ddf4ff] px-2 py-1"
                  : "px-2 py-1"
              }
            >
              {item.icon}
              <span className="sr-only">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
