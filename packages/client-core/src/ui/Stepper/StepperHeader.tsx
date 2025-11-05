import React from 'react'
import {Box, BoxProps, SxProps, Theme, useTheme} from '@mui/material'
import {fnSwitch} from '@axanc/ts-utils'
import {alphaVar, makeSx, styleUtils} from '../../core/theme.js'
import {useStepperContext} from './Stepper.js'
interface StepperHeaderProps extends BoxProps {
  steps: (string | undefined)[]
  stepSize?: number
  stepMargin?: number
  hideLabel?: boolean
}

type StepState = 'done' | 'current' | 'not_done'

export const StepperHeader = ({sx, steps, stepSize = 32, stepMargin = 8, hideLabel}: StepperHeaderProps) => {
  const {goTo, currentStep} = useStepperContext()
  const t = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        mb: 3,
        mt: 1,
        justifyContent: 'center',
        ...sx,
      }}
    >
      {steps.map((step, i) => {
        const state: StepState = currentStep > i ? 'done' : currentStep === i ? 'current' : 'not_done'
        return (
          <Box key={i} sx={{flex: 1}} onClick={goTo ? () => i < currentStep && goTo(i) : undefined}>
            <Box
              sx={{
                ...{
                  cursor: state === 'not_done' ? 'not-allowed' : 'pointer',
                },
                display: 'flex',
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              {i > 0 && (
                <Box
                  sx={{
                    display: 'block',
                    position: 'absolute',
                    top: stepSize / 2 - 1,
                    left: `calc(-50% + ${stepSize / 2 + stepMargin}px)`,
                    right: `calc(50% + ${stepSize / 2 + stepMargin}px)`,
                    ...(state === 'not_done'
                      ? {
                          borderTop: '2px solid ' + t.vars.palette.divider,
                        }
                      : {
                          borderTop: '2px solid ' + t.vars.palette.success.light,
                        }),
                  }}
                />
              )}
              <Box
                sx={{
                  height: stepSize,
                  width: stepSize,
                  borderRadius: stepSize,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: '700',
                  ...(stepSize <= 30 && {
                    fontSize: styleUtils(t).fontSize.small,
                  }),
                  justifyContent: 'center',
                  transition: t.transitions.create('all'),
                  mr: 1,
                  ml: 1,
                  ...fnSwitch<StepState, SxProps<Theme>>(
                    state,
                    makeSx({
                      done: {
                        border: `2px solid ${t.vars.palette.success.light}`,
                        background: alphaVar(t.vars.palette.success.main, 0.2),
                        color: t.vars.palette.success.main,
                      },
                      current: {
                        boxShadow: `0px 0px 0px ${stepSize > 30 ? 4 : 2}px ${alphaVar(t.vars.palette.primary.main, 0.3)}`,
                        color: t.vars.palette.primary.contrastText,
                        backgroundColor: 'primary.main',
                      },
                      not_done: {
                        border: `2px solid ${t.vars.palette.divider}`,
                        color: t.vars.palette.text.disabled,
                      },
                    }),
                  ),
                }}
              >
                {i + 1}
              </Box>
              {!hideLabel && (
                <Box
                  sx={{
                    mt: .5,
                    textAlign: 'center',
                    ...fnSwitch<StepState, SxProps<Theme>>(
                      state,
                      makeSx({
                        done: {
                          color: 'success.main',
                        },
                        current: {
                          fontWeight: t.typography.fontWeightBold,
                          color: 'primary.main',
                        },
                        not_done: {
                          color: t.vars.palette.text.disabled,
                        },
                      }),
                      () => ({}),
                    ),
                  }}
                >
                  {step}
                </Box>
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
