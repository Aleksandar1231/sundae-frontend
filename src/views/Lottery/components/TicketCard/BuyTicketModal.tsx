import { BigNumber } from 'ethers';
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { getFullDisplayBalance } from '../../../../utils/formatBalance'
import TicketInput from '../../components/TicketInput'
import ModalActions from '../../../../components/ModalActions'
import { useMultiBuyLottery, useMaxNumber } from '../../../../hooks/useBuyLottery'
import { LOTTERY_MAX_NUMBER_OF_TICKETS, LOTTERY_TICKET_PRICE } from '../../../../config/index'
import { Button } from '@material-ui/core';
import Modal from '../../../../components/Modal';
import ModalTitle from '../../../../components/ModalTitle';


interface BuyTicketModalProps {
  max: BigNumber
  onConfirm?: (amount: string, numbers: Array<number>) => void
  onDismiss?: () => void
  tokenName?: string
}

const BuyTicketModal: React.FC<BuyTicketModalProps> = ({ max, onDismiss }) => {
  const [val, setVal] = useState('1')
  const [pendingTx, setPendingTx] = useState(false)
  const [, setRequestedBuy] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const maxTickets = useMemo(() => {
    return parseInt(getFullDisplayBalance(max.div(LOTTERY_TICKET_PRICE)), 10)
  }, [max])

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => setVal(e.currentTarget.value)

  const { onMultiBuy } = useMultiBuyLottery()
  const maxNumber = useMaxNumber()
  const handleBuy = useCallback(async () => {
    try {
      setRequestedBuy(true)
      const length = parseInt(val)
      // @ts-ignore
      // eslint-disable-next-line prefer-spread
      const numbers = Array.apply(null, { length }).map(() => [
        Math.floor(Math.random() * maxNumber) + 1,
        Math.floor(Math.random() * maxNumber) + 1,
        Math.floor(Math.random() * maxNumber) + 1,
        Math.floor(Math.random() * maxNumber) + 1,
      ])
      const txHash = await onMultiBuy(LOTTERY_TICKET_PRICE.toString(), numbers)
      // user rejected tx or didn't go thru
      if (txHash) {
        setRequestedBuy(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onMultiBuy, setRequestedBuy, maxNumber, val])

  const handleSelectMax = useCallback(() => {
    if (Number(maxTickets) > LOTTERY_MAX_NUMBER_OF_TICKETS) {
      setVal(LOTTERY_MAX_NUMBER_OF_TICKETS.toString())
    } else {
      setVal(maxTickets.toString())
    }
  }, [maxTickets])

  const handleDismiss = useCallback(() => onDismiss(), [onDismiss]);

  const lydCosts = (amount: string): number => {
    return +amount * LOTTERY_TICKET_PRICE
  }
  return (
    <Modal>
      <ModalTitle text={'Enter amount of tickets to buy'} />
      <TicketInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol="TICKET"
        availableSymbol="LYD"
      />
      <div>
        <Tips>{t(`1 Ticket = ${LOTTERY_TICKET_PRICE} LYD`, { num: LOTTERY_TICKET_PRICE })}</Tips>
      </div>
      <div>
        <Announce>{t('Ticket purchases are final. Your LYD cannot be returned to you after buying tickets.')}</Announce>
        <Final>{t(`You will spend: ${lydCosts(val)} LYD`)}</Final>
      </div>
      <ModalActions>
        <Button style={{ width: '100%' }} variant="contained" onClick={handleDismiss}>
          {t('Cancel')}
        </Button>
        <Button
          id="lottery-buy-complete"
          disabled={
            pendingTx ||
            parseInt(val) > Number(maxTickets) ||
            parseInt(val) > LOTTERY_MAX_NUMBER_OF_TICKETS ||
            parseInt(val) < 1
          }
          onClick={async () => {
            setPendingTx(true)
            await handleBuy()
            setPendingTx(false)
            onDismiss()
          }}
          style={{ width: '100%' }}
        >
          {pendingTx ? t('Pending Confirmation') : t('Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default BuyTicketModal

const Tips = styled.div`
  margin-left: 0.4em;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`

const Final = styled.div`
  margin-top: 1em;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`
const Announce = styled.div`
  margin-top: 1em;
  margin-left: 0.4em;
  color: #ed4b9e;
`
