'use client';
import { useState } from 'react';
import { Modal, ModalProps } from './modal';
import { useModal } from '../hooks';
import { MenuStep, useMultistepMenu } from '../hooks/useMultistepMenu';
import { TransitionPanel } from './transition-panel';
import { Button } from './button';
import { LuChevronRight, LuX } from 'react-icons/lu';
import { useMeasure } from '@uidotdev/usehooks'


export type MultistepModalProps = Omit<ModalProps, 'children'> & {
  steps: MenuStep[];
};

export const MultistepModal: React.FC<MultistepModalProps> = ({
  steps,
  ...modalProps
}) => {
  const modal = useModal();
  const controls = useMultistepMenu(steps);
  const [direction, setDirection] = useState(1);
  const [ref, bounds] = useMeasure();

  const goNext = async () => {
    if (!controls.navigationDisabled) {
      await controls.goNext();
      setDirection(1);
    }
  };

  const goBack = async () => {
    if (!controls.navigationDisabled) {
      await controls.goBack();
      setDirection(-1);
    }
  };

  return (
    <Modal
      closeAction={() => controls.reset()}
      type={modalProps.type}
      name={modalProps.name}
      description={modalProps.description}
      Icon={modalProps.Icon}
    >
      <TransitionPanel
        activeIndex={controls.currentIndex}
        variants={{
          enter: ({ direction, measured }) => ({
            x: direction > 0 ? 364 : -364,
            opacity: 0,
            height:
              measured.height && measured.height > 0 ? measured.height : 'auto',
            position: 'initial',
          }),
          center: ({ measured }) => ({
            zIndex: 1,
            x: 0,
            opacity: 1,
            height:
              measured.height && measured.height > 0 ? measured.height : 'auto',
          }),
          exit: ({ direction }) => ({
            zIndex: 0,
            x: direction < 0 ? 364 : -364,
            opacity: 0,
            position: 'absolute',
            top: 0,
            width: '100%',
          }),
        }}
        transition={{
          x: { type: 'spring', stiffness: 175, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        custom={{ direction, measured: bounds }}
      >
        <div key={controls.currentStep?.id} ref={ref}>
          {steps[controls.currentIndex]?.content(controls)}
        </div>
      </TransitionPanel>

            {!controls.navigationDisabled && (
        <div className="grid grid-cols-2 items-center gap-2">
          <div>
            {controls.currentIndex > 0 && (
              <Button
                onClick={goBack}
                variant={'ghost'}
                className="gap-1 items-center flex"
              >
                Back
              </Button>
            )}
          </div>

          <div className="flex justify-end gap-2 items-center">
            <Button
              onClick={() => modal.close()}
              variant={'secondary'}
              className="gap-1 items-center flex"
            >
              <LuX />
              Cancel
            </Button>
            <Button
              disabled={!controls.canGoNext}
              onClick={goNext}
              className="gap-1 items-center flex"
            >
              Continue
              <LuChevronRight />
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
