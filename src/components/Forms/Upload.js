import React from 'react';
import Dropzone from 'react-dropzone';
import { Text, Box, Input } from '@chakra-ui/react';

export default function Upload({ onUpload }) {
  const renderDragMessage = (isDragActive, isDragReject) => {
    if (!isDragActive) {
      return <Box>Arraste arquivos aqui...</Box>;
    }

    if (isDragReject) {
      return <Text color="red.400">Arquivo não suportado</Text>;
    }

    return <Text color="green.400">Solte os arquivos aqui</Text>;
  };

  return (
    <Dropzone accept="*/*" onDropAccepted={onUpload}>
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
        <Box {...getRootProps()} isDragActive={isDragActive} isDragReject={isDragReject}>
          <Input {...getInputProps()} />
          {renderDragMessage(isDragActive, isDragReject)}
        </Box>
      )}
    </Dropzone>
  );
}
