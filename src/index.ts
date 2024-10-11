import RaydiumSwap from './RaydiumSwap';
import { Transaction, VersionedTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import 'dotenv/config';

/**
 * Performs a token swap on the Raydium protocol.
 * Depending on the configuration, it can execute the swap or simulate it.
 */
const swap = async () => {
  /**
   * The RaydiumSwap instance for handling swaps.
   */
  const privateURL =process.env.PrivateURL.toString()
  const subPrivateKey = process.env.SubPrivateKey.toString();
  const liquidityFile = process.env.LiquidityFile.toString();
  const tokenAAmount = parseFloat(process.env.TokenAAmount.toString());
  const tokenAAdress = process.env.TokenAAddress.toString();
  const tokenBAdress = process.env.TokenBAddress.toString();
  const useVersionedTransaction = Boolean(process.env.UseVersionedTransaction.toString());
  const slippageRate = parseFloat(process.env.SlippageRate.toString())
  const fee = parseFloat(process.env.Fee.toString())
  const executeSwap = Boolean(process.env.ExecuteSwap.toString());
  const maxRetries = parseInt(process.env.MaxRetries.toString());
  const fixedSide = process.env.FIXED_SIDE.toString() === 'in' ? 'in' : 'out'

  const raydiumSwap = new RaydiumSwap(privateURL, subPrivateKey);
  console.log(`Raydium swap initialized`);
  console.log(`Swapping ${tokenAAmount} of ${tokenAAdress} for ${tokenBAdress}...`)
  console.log(`useVersionedTransaction: ${useVersionedTransaction}, executeSwap: ${executeSwap}...`)

  /**
   * Load pool keys from the Raydium API to enable finding pool information.
   */

  await raydiumSwap.loadPoolKeys(liquidityFile);
  console.log(`Loaded pool keys`);

  /**
   * Find pool information for the given token pair.
   */
  const poolInfo = raydiumSwap.findPoolInfoForTokens(tokenAAdress, tokenBAdress);
  if (!poolInfo) {
    console.error('Pool info not found');
    return 'Pool info not found';
  } else {
    console.log('Found pool info');
  }

  /**
   * Prepare the swap transaction with the given parameters.
   */



  const tx = await raydiumSwap.getSwapTransaction(
    tokenBAdress,
    tokenAAmount,
    poolInfo,
    fee * LAMPORTS_PER_SOL,
    useVersionedTransaction,
    fixedSide,
    slippageRate
  );
  console.log('tx made');

  /**
   * Depending on the configuration, execute or simulate the swap.
   */
  if (executeSwap) {
    /**
     * Send the transaction to the network and log the transaction ID.
     */
    const txid = useVersionedTransaction
      ? await raydiumSwap.sendVersionedTransaction(tx as VersionedTransaction, maxRetries)
      : await raydiumSwap.sendLegacyTransaction(tx as Transaction, maxRetries);
    console.log(`Sending txid`);
    console.log(`https://solscan.io/tx/${txid}`);

  } else {
    /**
     * Simulate the transaction and log the result.
     */
    const simRes = useVersionedTransaction
      ? await raydiumSwap.simulateVersionedTransaction(tx as VersionedTransaction)
      : await raydiumSwap.simulateLegacyTransaction(tx as Transaction);
    console.log(`get in Simulate`);
    console.log(simRes);
  }
};

swap();
