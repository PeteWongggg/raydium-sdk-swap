MAIN = 'https://api.mainnet-beta.solana.com'

import subprocess
import os, sys
from src.conf.tokens import *

def Buy(base_token=SOL, token_address=USDC, amount=0.01, fee=0.0005, slippageRate=5, liquideFile='trimmed_mainnet.json',
        useVersionedTransaction=True, fixSIde='in', executeSwap=False, maxRetries=3):

    env = os.environ.copy()
    env['TokenAAddress'] = base_token
    env['TokenAAmount'] = str(amount)
    env['TokenBAddress'] = token_address
    env['LiquidityFile'] = liquideFile
    env['Fee'] = str(fee)
    env['UseVersionedTransaction'] = str(useVersionedTransaction)
    env['FIXED_SIDE'] = fixSIde
    env['ExecuteSwap'] = str(executeSwap)
    env['MaxRetries'] = str(maxRetries)

    cmd_1 = ['cd' 'src']
    result = subprocess.run(cmd_1)

    cmd_2 = ['ts-node' 'trimMainnet.ts']
    result = subprocess.run(cmd_2, env=env)

    cmd_3 = ['cd', '..']
    result = subprocess.run(cmd_3)

    # 执行命令
    cmd_4 = ['yarn', 'swap']
    result = subprocess.run(cmd_4, env=env)

    print(result.stdout)
    print(result.stderr)


if __name__ == '__main__':
    Buy(executeSwap=True)
