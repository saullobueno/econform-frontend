import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Skeleton,
  Stack,
} from '@chakra-ui/react';
import { Loading } from 'components/Loading';

export default function BaseModal({
  title = '',
  isOpen = false,
  onClose = () => {},
  loading = false,
  isSubmitting = false,
  children = {},
  footer = {},
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {title}{' '}
          {(loading || isSubmitting) && (
            <Loading color="white" display="inline-block" w="auto" size="sm" py="0" ml="4" />
          )}{' '}
        </ModalHeader>
        <ModalCloseButton />
        {loading && !isSubmitting ? (
          <ModalBody opacity={loading ? '.2' : '1'}>
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          </ModalBody>
        ) : (
          <ModalBody opacity={isSubmitting ? '.2' : '1'}>{children}</ModalBody>
        )}
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
}
