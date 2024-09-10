import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Text,
  Menu,
  Flex,
  Button,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  Heading,
  Container,
} from "@chakra-ui/react";
import logo from "../../assets/logo.png";
import { UserContext } from "../../contexts/user";
import SignUp from "../auth/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../stores/slices/userSlice";
import { RootState } from "../../stores";
import { toggleDarkMode } from "../../stores/slices/darkModeSlice";

function NavLink({ text, href }: { text: string; href: string }) {
  return (
    <Link to={href}>
      <Text color="#6459F5" fontWeight="semibold">
        {text}
      </Text>
    </Link>
  );
}

export default function Navbar() {
  const user = useContext(UserContext);
  console.log("RENDER", user);
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  function openLogInModal() {
    setIsLoginModalOpen(true);
  }

  function closeLoginModal() {
    setIsLoginModalOpen(false);
  }
  const signOut = async () => {
    localStorage.removeItem("token");
    dispatch(setUser({}));
  };

  const [_isDarkMode, setIsDarkMode] = useState(false);

  const _toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    dispatch(toggleDarkMode());
  };

  return (
    <Container maxW="7xl" zIndex={100}>
      <SignUp isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <Flex
        bgColor="transparent"
        flexDirection="row"
        justifyContent="space-between"
        py={5}
        pr={6}
      >
        <Flex alignItems="center">
          <img src={logo} alt="logo" width={40} />
          <Heading fontSize="2xl" fontWeight="bold" ml={2}>
            <Link to="/" className={isDarkMode ? "text-white" : ""}>
              Pivx Scholar
            </Link>
          </Heading>
        </Flex>
        <Flex>
          {/* {!user.username && (
            <Button
              onClick={() => {
                user.signInOrRegister();
              }}
              bg="#6459F5"
              color="#ffffff"
              variant="solid"
            >
              Login with Metamask
            </Button>
          )} */}
          {/* <Button
            onClick={signOut}
            bg="#6459F5"
            color="#ffffff"
            variant="solid"
          >
            Signout
          </Button> */}
          
          {!user.username ? (
            <>
              <div>
                <div className="flex items-center mt-1">
                  <button
                    className={`${
                      isDarkMode
                        ? "bg-gray-800 border-gray-800"
                        : "bg-gray-300 border-gray-200"
                    } w-14 h-8 rounded-full p-1 duration-300 ease-in-out relative border-2 focus:outline-none focus:ring-2 focus:ring-gray-500`}
                    onClick={_toggleDarkMode}
                  >
                    <div
                      className={`${
                        isDarkMode ? "translate-x-4" : "-translate-x-4"
                      } inline-block w-5 h-5 transform duration-300 ease-in-out bg-white rounded-full shadow-lg`}
                    />
                  </button>
                  <span className="ml-2 text-gray-500 dark:text-gray-200">
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => {
                  setIsLoginModalOpen(true);
                }}
                bg="#6459F5"
                color="#ffffff"
                variant="solid"
                className="ml-3"
              >
                Create wallet
              </Button>
            </>
          ) : (
            <Flex alignItems="center" gridGap={6}>
              <NavLink text="Home" href="/" />
              <NavLink text="Upload" href="/paper" />
              <NavLink text="Browse" href="/browse" />

              <Menu>
                <MenuButton>
                  <Avatar size="sm"></Avatar>
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    Signed in as &nbsp;
                    <Text fontWeight="bold">{user.username}</Text>
                  </MenuItem>
                  <MenuItem as={Link} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => user.signOut()}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
