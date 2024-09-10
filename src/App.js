import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { abi } from './abi'; 
import './App.css';

const CONTRACT_ADDRESS = '0x32563D86821E420F06ceCCCE1900Ee0fdb941e41';

function App() {
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [loanAmount, setLoanAmount] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [fixedDepositAmount, setFixedDepositAmount] = useState('');
    const [withdrawFixed, setFixedDepositWithdrawAmount] = useState('');
    const [error, setError] = useState('');
    const [repayLoan, setRepayAmount] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('account1');
    const [accountNumber] = useState('');
   // const [setTransactionHash] = useState('');

    useEffect(() => {
        const initWeb3 = async () => {
            try {
                if (window.ethereum) {
                    const web3 = new Web3(window.ethereum);
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const accounts = await web3.eth.getAccounts();
                    setAccount(accounts[0]);
                    
                    const contractInstance = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
                    setContract(contractInstance);
                    
                    const accountsData = await contractInstance.methods.getAllAccounts().call();
                    setAccounts(accountsData);
                } else {
                    setError('MetaMask is not installed');
                }
            } catch (error) {
                console.error("Error initializing Web3:", error);
                setError('Failed to initialize Web3 or connect to the contract.');
            }
        };

        initWeb3();
    }, [selectedAccount]);

    const checkContractBalance = async () => {
        try {
            const web3 = new Web3(window.ethereum);
            const balance = await web3.eth.getBalance(CONTRACT_ADDRESS);
            console.log(`Contract balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
        } catch (error) {
            console.error("Error checking contract balance:", error);
        }
    };

    const handleApplyForLoan = async () => {
        try {
            await checkContractBalance();
            const tx = await contract.methods.applyForLoan(Web3.utils.toWei(loanAmount, 'ether')).send({
                from: account,
                gas: 300000// Setting the gas limit to 300,000
            });
            console.log("Successfully got the loan", tx);
        } catch (error) {
            console.error("Error applying for loan:", error);
            if (error.data && error.data.message) {
                setError(`Failed to apply for loan: ${error.data.message}`);
            } else {
                setError('Failed to apply for loan.');
            }
        }
    };
    

    

    const handleCreateAccount = async () => {
        const address = document.getElementById("createAccountAddress").value;
        const name = document.getElementById("createAccountName").value;
        const number = document.getElementById("createAccountNumber").value;
        try {
            const tx = await contract.methods.createAccount(address, name, number).send({ from: account });
            console.log("Account Created Successfully", tx);
        } catch (error) {
            console.error("Error creating account:", error);
            setError('Failed to create account.');
        }
    };

    const handleDeposit = async () => {
        try {
            const tx = await contract.methods.deposit().send({ from: account, value: Web3.utils.toWei(depositAmount, 'ether') });
            console.log("Successfully deposited amount", tx);
        } catch (error) {
            console.error("Error depositing:", error);
            setError('Failed to deposit.');
        }
    };

    const handleWithdraw = async () => {
        try {
            const tx = await contract.methods.withdraw(Web3.utils.toWei(withdrawAmount, 'ether')).send({ from: account });
            console.log("Amount successfully withdrawn", tx);
        } catch (error) {
            console.error("Error withdrawing:", error);
            setError('Failed to withdraw.');
        }
    };

    const handleDepositFixed = async () => {
        try {
            const tx = await contract.methods.depositFixed().send({ from: account, value: Web3.utils.toWei(fixedDepositAmount, 'ether') });
            console.log("Successfully deposited fixed amount", tx);
        } catch (error) {
            console.error("Error depositing fixed amount:", error);
            setError('Failed to deposit fixed amount.');
        }
    };

    const handleWithdrawFixed = async () => {
        try {
            const tx = await contract.methods.withdrawFixed().send({ from: account });
            console.log("Successfully withdrew fixed deposit", tx);
        } catch (error) {
            console.error("Error withdrawing fixed deposit:", error);
            setError('Failed to withdraw fixed deposit.');
        }
    };

    const handleTransfer = async () => {
        const toAddress = document.getElementById("transferToAddress").value;
        const amount = document.getElementById("transferAmount").value;

        if (!Web3.utils.isAddress(toAddress)) {
            setError('Invalid recipient address.');
            return;
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            setError('Invalid amount. Must be greater than zero.');
            return;
        }

        try {
            const tx = await contract.methods.transfer(toAddress, Web3.utils.toWei(amount, 'ether')).send({ from: account });
            console.log("Transfer successful:", tx);
        } catch (error) {
            console.error("Error transferring:", error);
            setError('Failed to transfer.');
        }
    };

    const handleRepayLoan = async () => {
        try {
            const tx = await contract.methods.repayLoan().send({ from: account, value: Web3.utils.toWei(repayLoan, 'ether') });
            console.log(tx);
        } catch (error) {
            console.error("Error repaying loan:", error);
            setError('Failed to repay loan.');
        }
    };

    const handleAccountChange = (event) => {
        setSelectedAccount(event.target.value);
    };

    return (
        <div className="App">
            <h1>Aayush Bank </h1>
            {error && <p className="error">{error}</p>}

            <h2>Account: {account}</h2>
           

            

            <h2>Apply for Loan</h2>
            <input
                type="text"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Amount in ETH"
            />
            <button onClick={handleApplyForLoan}>Apply for Loan</button>

            <h2>Create Account</h2>
            <input type="text" placeholder="Account Address" id="createAccountAddress" />
            <input type="text" placeholder="Name" id="createAccountName" />
            <input type="number" placeholder="Account Number" id="createAccountNumber" />
            <button onClick={handleCreateAccount}>Create Account</button>

            <h2>Deposit</h2>
            <input
                type="text"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount in ETH"
            />
            <button onClick={handleDeposit}>Deposit</button>

            <h2>Withdraw</h2>
            <input
                type="text"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount in ETH"
            />
            <button onClick={handleWithdraw}>Withdraw</button>

            <h2>Fixed Deposit</h2>
            <input
                type="text"
                value={fixedDepositAmount}
                onChange={(e) => setFixedDepositAmount(e.target.value)}
                placeholder="Amount in ETH"
            />
            <button onClick={handleDepositFixed}>Deposit Fixed</button>

            <h2>Withdraw Fixed Deposit</h2>
            <button onClick={handleWithdrawFixed}>Withdraw Fixed Deposit</button>

            <h2>Transfer</h2>
            <input type="text" placeholder="Recipient Address" id="transferToAddress" />
            <input
                type="text"
                placeholder="Amount in ETH"
                id="transferAmount"
            />
            <button onClick={handleTransfer}>Transfer</button>

            <h2>Repay Loan</h2>
            <input
                type="text"
                value={repayLoan}
                onChange={(e) => setRepayAmount(e.target.value)}
                placeholder="Amount in ETH"
            />
            <button onClick={handleRepayLoan}>Repay Loan</button>


            <h2>Account List</h2>
            <ul>
                {accounts.map((acc, index) => (
                    <li key={index}>
                        {acc.name} - Account Number: {account} - Exists: {acc.exists.toString()}
                    </li>
                ))}
            </ul>

        </div>
    );
}

export default App;
