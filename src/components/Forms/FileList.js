import React from 'react';
import { MdCheckCircle, MdError, MdLink } from 'react-icons/md';

const FileList = ({ files, onDelete }) => (
  <Container>
    {files.map((uploadedFile) => (
      <li key={uploadedFile.id}>
        <FileInfo>
          <Preview src={uploadedFile.preview} />
          <div>
            <strong>{uploadedFile.name}</strong>
            <span>
              {uploadedFile.readableSize}{' '}
              {!!uploadedFile.url && <button onClick={() => onDelete(uploadedFile.id)}>Excluir</button>}
            </span>
          </div>
        </FileInfo>

        <div>
          {!uploadedFile.uploaded && !uploadedFile.error && 'Carregando...'}

          {uploadedFile.url && (
            <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer">
              <MdLink style={{ marginRight: 8 }} size={24} color="#222" />
            </a>
          )}

          {uploadedFile.uploaded && <MdCheckCircle size={24} color="#78e5d5" />}
          {uploadedFile.error && <MdError size={24} color="#e57878" />}
        </div>
      </li>
    ))}
  </Container>
);

export default FileList;
