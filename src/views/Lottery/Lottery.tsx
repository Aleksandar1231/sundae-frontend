import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PastLotteryDataContext from '../../contexts/PastLotteryDataContext'
import { getLotteryIssueIndex } from '../../utils/lotteryUtils'
import { useLottery } from '../../hooks/useContract'
import Page from '../../components/Page';
import Hero from './components/Hero'
import Divider from './components/Divider'
import NextDrawPage from './NextDrawPage'
import PastDrawsPage from './PastDrawsPage'
import { Button } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`

const Lottery: React.FC = () => {
  const lotteryContract = useLottery()
  const [activeIndex, setActiveIndex] = useState(0)
  const [historyData, setHistoryData] = useState([])
  const [historyError, setHistoryError] = useState(false)
  const [currentLotteryNumber, setCurrentLotteryNumber] = useState(0)
  const [mostRecentLotteryNumber, setMostRecentLotteryNumber] = useState(1)

  useEffect(() => {
    fetch(`https://api.lydia.finance/api/lotteryHistory`)
      .then((response) => response.json())
      .then((data) => setHistoryData(data))
      .catch(() => {
        setHistoryError(true)
      })
  }, [])

  useEffect(() => {
    const getInitialLotteryIndex = async () => {
      const index = await getLotteryIssueIndex(lotteryContract)
      const previousLotteryNumber = index - 1

      setCurrentLotteryNumber(index)
      setMostRecentLotteryNumber(previousLotteryNumber)
    }

    if (lotteryContract) {
      getInitialLotteryIndex()
    }
  }, [lotteryContract])

  const handleClick = (event, value) => {
    setActiveIndex(parseInt(value))
  }

  return (
    <>
      <Hero />
      <Page>
        <Wrapper>
          <ToggleButtonGroup color="primary"
            value={'horizontal'}
            exclusive
            onChange={handleClick}
            size='small'
          >
            <ToggleButton value="0">Next draw</ToggleButton>
            <ToggleButton value="1">Past draws</ToggleButton>
          </ToggleButtonGroup>




          {/* <ButtonMenu activeIndex={activeIndex} onItemClick={handleClick} scale="sm" variant="subtle">
            <Button>{t('Next draw')}</Button>
            <Button>{t('Past draws')}</Button>
          </ButtonMenu> */}
        </Wrapper>
        <Divider />
        <PastLotteryDataContext.Provider
          value={{ historyError, historyData, mostRecentLotteryNumber, currentLotteryNumber }}
        >
          {activeIndex === 0 ? <NextDrawPage /> : <PastDrawsPage />}
        </PastLotteryDataContext.Provider>
      </Page>
    </>
  )
}

export default Lottery
