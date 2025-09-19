'use client'
import {useEffect, useState} from 'react'
import Box, {BoxProps} from '@mui/material/Box'

type AnimatedTextProps = BoxProps & {
  text: string
  speed?: number
  cursorBlinkRate?: number
  hideCursorOnComplete?: boolean
  initialDelay?: number
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text = '',
  speed = 75,
  cursorBlinkRate = 530,
  initialDelay = 0,
  hideCursorOnComplete = true,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState<string>('')
  const [showCursor, setShowCursor] = useState<boolean>(true)
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [hasStarted, setHasStarted] = useState<boolean>(initialDelay === 0)

  useEffect(() => {
    if (initialDelay > 0 && !hasStarted) {
      const delayTimeout = setTimeout(() => {
        setHasStarted(true)
      }, initialDelay)

      return () => clearTimeout(delayTimeout)
    }
  }, [initialDelay, hasStarted])
  useEffect(() => {
    if (isPaused) return

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1))
      }, speed)

      return () => clearTimeout(timeout)
    } else if (!isComplete) {
      setIsComplete(true)
    }
  }, [displayedText, text, speed, isPaused, isComplete])

  // Handle cursor blinking
  useEffect(() => {
    // If typing is complete and we want to hide the cursor, don't blink
    if (isComplete && hideCursorOnComplete) {
      setShowCursor(false)
      return
    }

    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, cursorBlinkRate)

    return () => clearInterval(interval)
  }, [cursorBlinkRate, isComplete, hideCursorOnComplete])

  return (
    <Box component="span" {...props}>
      {displayedText}
      {(!isComplete || !hideCursorOnComplete) && (
        <span
          style={{
            opacity: showCursor ? 1 : 0,
            transition: 'opacity 0.1s',
          }}
        >
          _
        </span>
      )}
    </Box>
  )
}
