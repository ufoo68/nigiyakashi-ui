import React, { useCallback, useState } from 'react'
import PubNub from 'pubnub'
import { PubNubProvider, usePubNub } from 'pubnub-react'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import { makeStyles } from '@material-ui/core/styles'
import logo from './logo.png'

const pubnub = new PubNub({
  publishKey: process.env.REACT_APP_PUB_KEY,
  subscribeKey: process.env.REACT_APP_SUB_KEY,
})

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preparedMessage: {
    flexDirection: 'row',
  },
  customMessage: {
    flexDirection: 'row',
  },
  logo: {
    width: 400,
  },
})

const simpleMessages = ['わーい！', 'すごーい！', 'たのしー！']

const Messenger = () => {
  const pubnub = usePubNub()
  const [input, setInput] = useState('')
  const classes = useStyles()

  const sendMessage = useCallback(
    async message => {
      await pubnub.publish({
        channel: 'nigiyakashi',
        message: { message },
      })

      setInput('')
    },
    [pubnub, setInput]
  )

  return (
    <div className={classes.container}>
      <img src={logo} alt='logo' className={classes.logo}/>
      <div className={classes.preparedMessage}>
        {simpleMessages.map(simpleMessage =>
          <Button
            onClick={e => {
              e.preventDefault()
              sendMessage(simpleMessage)
            }}
            variant="outlined"
          >{simpleMessage}</Button>
        )}
      </div>
      <div className={classes.customMessage}>
        <Input
          type="text"
          placeholder="自由記入欄"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <Button
          onClick={e => {
            e.preventDefault()
            sendMessage(input)
          }}
          variant="contained"
          color="primary"
        >
          送信
      </Button>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <PubNubProvider client={pubnub}>
      <Messenger />
    </PubNubProvider>
  )
}

export default App