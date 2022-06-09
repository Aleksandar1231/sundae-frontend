import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useTotalClaim } from '../../hooks/useTickets'
import Card from '../../components/Card';
import YourPrizesCard from './components/YourPrizesCard'
import UnlockWalletCard from './components/UnlockWalletCard'
import TicketCard from './components/TicketCard'
import TotalPrizesCard from './components/TotalPrizesCard'
import WinningNumbers from './components/WinningNumbers'
import HowItWorks from './components/HowItWorks'
import { getBalance } from '../../utils/formatBalance'


const SecondCardColumnWrapper = styled.div<{ isAWin?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isAWin ? 'column' : 'column-reverse')};
`

const NextDrawPage: React.FC = () => {
  const { account } = useWeb3React()
  const { claimAmount, setLastUpdated } = useTotalClaim()
  const winnings = getBalance(claimAmount)
  const isAWin = winnings > 0

  const handleSuccess = useCallback(() => {
    setLastUpdated()
  }, [setLastUpdated])

  return (
    <>
      <Card>
        <TotalPrizesCard />
        <SecondCardColumnWrapper isAWin={isAWin}>
          {!account ? (
            <UnlockWalletCard />
          ) : (
            <>
              <YourPrizesCard isAWin={isAWin} onSuccess={handleSuccess} />
              <TicketCard isSecondCard={isAWin} />
            </>
          )}
        </SecondCardColumnWrapper>
      </Card>
      <HowItWorks />
      {/* legacy page content */}
      <WinningNumbers />
    </>
  )
}

export default NextDrawPage
