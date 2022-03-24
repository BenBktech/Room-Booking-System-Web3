import React, { useState } from "react";
import {
  Button,
  Flex,
  useToast,
  Text,
  Spinner,
  chakra,
} from "@chakra-ui/react";
import { hasMetamask } from "../../utils/hasMetamask";
import useEthersProvider from "../../hooks/useEthersProvider";
import { ethers } from "ethers";

const Header = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { account, setAccount, provider } =useEthersProvider();
  const toast = useToast();

  const connectWallet = async () => {
    if (!hasMetamask()) {
        toast({
            description:
            "MetaMask is unavailable, please install Metamask browser extension and retry",
            status: "error",
            duration: 4000,
            isClosable: true,
        });
    } else {
        setIsLoading(true);
        if (provider) {
        let network = await provider.getNetwork();
        if (network.chainId !== 1) {
            const resultAccount = await provider.send("eth_requestAccounts", []);
            setAccount(ethers.utils.getAddress(resultAccount[0]));
            setIsLoading(false);
            toast({
            description: "Your wallet has been successfully connected!",
            status: "success",
            duration: 4000,
            isClosable: true,
            });
        } else {
            setAccount(null);
            setIsLoading(false);
            toast({
                description: "Please switch to Main Ethereum Network on Metamask",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        }
      }
    }
  };

  return (
    <Flex
      align="center"
      justify="flex-start"
      flexDir={["column", "column", "row", "row"]}
      my="md"
      px={["sm", "sm", "lg", "lg"]}
      p="2rem"
    >
      <Text
        fontSize={30}
        fontWeight={800}
        letterSpacing={3}
        mb={["sm", "sm", 0, 0]}
        cursor="pointer"
      >
        Room Booking
      </Text>
      <Flex align="center" justify="flex-end" flex={1}>
          {isLoading ? (
              <Spinner />
          ) : (
            account ? (
                <Text>
                    <chakra.span>Connected Wallet : </chakra.span>
                    <chakra.span fontWeight="bold" color="red">{account.substring(0,5)}...{account.substring(account.length, account.length - 5)}</chakra.span>
                </Text>
            ) : (
                <Button
                    colorScheme="red"
                    fontSize={15}
                    onClick={() => connectWallet()}
                >
                    Connect Wallet
                </Button>
            )
          )}
      </Flex>
    </Flex>
  );
};

export default Header;