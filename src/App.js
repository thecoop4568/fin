import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import "./styles/reset.css";

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: .5px;
  border: none;
  background-color: #1b1f30;
  padding: 10px;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  color: #ffffff;
  width: 200px;
  cursor: pointer;
  box-shadow: 0px 0px 0px 3px rgba(50, 61, 111, 0.5);
  -webkit-box-shadow: 0px 0px 0px 3px rgba(50, 61, 111, 1.0);
  -moz-box-shadow: 0px 0px 0px 3px rgba(50, 61, 111, 0.5);
  :active {
    box-shadow: none;
    -webkit-box-shadow: 0px 0px 0px 3px rgba(50, 61, 111, 1.0);
    -moz-box-shadow: none;
  }
  :hover {
    -webkit-box-shadow: 0px 0px 0px 3px rgba(86, 105, 195, 1.0);
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #1b1f30;
  padding: 10px;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 35px;
  height: 35px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: ;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: column;
  }
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState(" Mint to join the coop");
  const [claimingNft, setClaimingNft] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);

  const claimNFTs = () => {
    let cost = 100000000000000;
    let gasLimit = 285000;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Releasing your chickens...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: 0x969554884af1081E61B96fd6Fa1d1f7b897b0bD8,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Try again");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Success!`  
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 30) {
      newMintAmount = 30;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{ backgroundColor: "var(--blue)" }}>
      <s.Container flex={1} ai={"center"} style={{ padding: 20 }}>
        <s.TextTitle
          style={{ textAlign: "center", fontSize: 42, fontWeight: "bold" }}
        >
          
        </s.TextTitle>
        <ResponsiveWrapper flex={10} style={{ padding: 0 }}>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <s.TextTitle
              style={{ textAlign: "center", fontSize: 26, fontWeight: "bold" }}
            >
              {data.totalSupply} / 10000
              <s.SpacerSmall/>
            </s.TextTitle>
          </s.Container>
          <s.Container
            flex={10}
            jc={"center"}
            ai={"center"}
            style={{ backgroundColor: "#1f2646", padding: 2 }}
          >
            {Number(data.totalSupply) == 10000 ? (
              <>
              <s.TextTitle
                style={{ textAlign: "center", color: "var(--white)" }}
              >
                Sold out!
              </s.TextTitle>
              <s.TextDescription
                style={{ textAlign: "center", color: "var(--white)" }}
              >
                Please visit OpenSea
              </s.TextDescription>
            </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--white)" }}
                >
                </s.TextTitle>
              
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--white)" }}
                >
                </s.TextDescription>
                
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--white)",
                      }}
                    >
                      Connect your wallet
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--white)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        fontSize: 19,
                        color: "var(--white)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerLarge />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--white)",
                        }}
                      >
                        {mintAmount} 
                      </s.TextDescription> 
                      <s.SpacerLarge />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "..." : "MINT"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
      </s.Container>
    </s.Screen>
  );
}

export default App;