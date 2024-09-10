import { ethers } from 'ethers';
import { abi } from './abi'; // Ensure this path is correct

const contractAddress = '0x831e722fe6B1832EAebD9D008E91C4dF1f7d042a'; // Your contract address

// Set up provider and contract
const provider = new ethers.BrowserProvider(window.ethereum);
const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());

// Function to get the balance of the contract
export async function getBalance() {
    try {
        const balance = await contract.getBalance();
        return ethers.formatEther(balance);
    } catch (error) {
        console.error('Error fetching balance:', error);
        throw error;
    }
}

// Function to create an account
export async function createAccount(accountAddress, name, accountNumber) {
    try {
        const tx = await contract.createAccount(accountAddress, name, accountNumber);
        await tx.wait();
        return 'Account created successfully';
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
}

// Function to deposit funds
export async function deposit(amountInEther) {
    try {
        const tx = await contract.deposit({ value: ethers.parseEther(amountInEther) });
        await tx.wait();
        return 'Deposit successful';
    } catch (error) {
        console.error('Error depositing funds:', error);
        throw error;
    }
}

// Function to apply for a loan
export async function applyForLoan(amountInEther) {
    try {
        const tx = await contract.applyForLoan(ethers.parseEther(amountInEther));
        await tx.wait();
        return 'Loan application successful';
    } catch (error) {
        console.error('Error applying for loan:', error);
        throw error;
    }
}

// Function to withdraw funds
export async function withdraw(amountInEther) {
    try {
        const tx = await contract.withdraw(ethers.parseEther(amountInEther));
        await tx.wait();
        return 'Withdrawal successful';
    } catch (error) {
        console.error('Error withdrawing funds:', error);
        throw error;
    }
}

// Function to transfer funds
export async function transfer(toAddress, amountInEther) {
    try {
        const tx = await contract.transfer(toAddress, ethers.parseEther(amountInEther));
        await tx.wait();
        return 'Transfer successful';
    } catch (error) {
        console.error('Error transferring funds:', error);
        throw error;
    }
}

// Function to repay a loan
export async function repayLoan(amountInEther) {
    try {
        const tx = await contract.repayLoan({ value: ethers.parseEther(amountInEther) });
        await tx.wait();
        return 'Loan repayment successful';
    } catch (error) {
        console.error('Error repaying loan:', error);
        throw error;
    }
}
