import React from 'react'
import styled from 'styled-components'
import Card from '../../components/Card';
import PastLotteryRoundViewer from './components/PastLotteryRoundViewer'
import PastDrawsHistoryCard from './components/PastDrawsHistory/PastDrawsHistoryCard'

const SecondCardColumnWrapper = styled.div<{ isAWin?: boolean }>`
  display: flex;
  flex-direction: column;
`

const BunnyImageWrapper = styled.div`
  display: flex;
  margin-top: 32px;
  justify-content: center;
`

const PastDrawsPage: React.FC = () => {
  return (
    <Card>
      <PastLotteryRoundViewer />
      <SecondCardColumnWrapper>
        <PastDrawsHistoryCard />
        <BunnyImageWrapper>
          <img src="/images/lydia-lottery-girl-sales.png" alt="lottery bunny" />
        </BunnyImageWrapper>
      </SecondCardColumnWrapper>
    </Card>
  )
}

export default PastDrawsPage
