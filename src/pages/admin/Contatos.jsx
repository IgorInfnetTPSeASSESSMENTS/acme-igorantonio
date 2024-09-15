import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { regexEmail, regexNumerico } from "../../infra/regex";
import { inserirContato, obterContato, excluirContato, listarContatos, atualizarContato } from "../../infra/contatos";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
export default function Contatos({ fornecedorId }) {
  const [contatos, setContatos] = useState([]);
  const [contatoIdEmEdicao, setContatoIdEmEdicao] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchContatos() {
      if (fornecedorId) {
        try {
          const contatos = await listarContatos(fornecedorId);
          setContatos(contatos);
        } catch (error) {
          console.error("Erro ao listar contatos:", error);
        }
      }
    }
    fetchContatos();
  }, [fornecedorId]);

  useEffect(() => {
    async function fetchData() {
      if (fornecedorId && contatoIdEmEdicao) {
        try {
          const contato = await obterContato(fornecedorId, contatoIdEmEdicao);
          setValue("nome", contato.nome);
          setValue("email", contato.email);
          setValue("fone", contato.fone);
        } catch (error) {
          console.error("Erro ao obter contato:", error);
        }
      } else {
        reset();
      }
    }
    fetchData();
  }, [fornecedorId, contatoIdEmEdicao, reset, setValue]);

  async function submeterDados(dados) {
    try {
      await inserirContato(fornecedorId, dados);
      atualizarListaContatos();
      setContatoIdEmEdicao("");
      reset();
    } catch (error) {
      console.error("Erro ao inserir contato:", error);
    }
  }

  async function handleExcluir() {
    try {
      await excluirContato(fornecedorId, contatoIdEmEdicao);
      atualizarListaContatos();
      setContatoIdEmEdicao("");
      reset();
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
    }
  }

  async function handleEditar(dados) {
    try {
      await atualizarContato(fornecedorId, contatoIdEmEdicao, dados);
      atualizarListaContatos();
      setContatoIdEmEdicao("");
      reset();
    } catch(error) {
      console.error("Erro ao atualizar contato", error);
    }

  }

  async function atualizarListaContatos() {
    if (fornecedorId) {
      try {
        const contatosAtualizados = await listarContatos(fornecedorId);
        setContatos(contatosAtualizados);
      } catch (error) {
        console.error("Erro ao atualizar lista de contatos:", error);
      }
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredContatos = contatos.filter(contato =>
    contato.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: 'nome', headerName: t('name'), flex: 1 },
    { field: 'email', headerName: 'E-mail', flex: 1 },
    { field: 'fone', headerName: t('phoneNumber'), flex: 1 },
  ];

  return (
    <>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom sx={{marginBottom: 3}}>{t('contactRegistration')}</Typography>
        <Box component="form" onSubmit={handleSubmit(submeterDados)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('name')}
            {...register('nome', {
              required: t('nameRequired'),
              minLength: { value: 5, message: t('nameMinLength') },
              maxLength: { value: 50, message: t('nameMaxLength') },
            })}
            error={!!errors.nome}
            helperText={errors.nome?.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="E-mail"
            {...register('email', {
              required: t('emailRequired'),
              minLength: { value: 5, message: t('emailMinLength') },
              maxLength: { value: 30, message: t('emailMaxLength') },
              pattern: { value: regexEmail, message: t('emailInvalid') },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t("phoneNumber")}
            {...register('fone', {
              required: t('phoneRequired'),
              minLength: { value: 8, message: t('phoneMinLength') },
              pattern: { value: regexNumerico, message: t('phoneNumeric') },
            })}
            error={!!errors.fone}
            helperText={errors.fone?.message}
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" type="submit">{t('save')}</Button>
            <Button variant="contained" color="error" type="button" onClick={handleExcluir} disabled={!contatoIdEmEdicao}>{t('delete')}</Button>
            <Button variant="contained" color="secondary" type="button" onClick={handleSubmit(handleEditar)} disabled={!contatoIdEmEdicao}>{t('edit')}</Button>
          </Box>
        </Box>

        {/* Campo de busca */}
        <Box sx={{ marginTop: 4 }}>
          <TextField
            label={t('searchContact')}
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t('enterContactName')}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Box sx={{ marginTop: 4, height: 300 }}> {/* Defina a altura máxima aqui */}
          <DataGrid
            rows={filteredContatos}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            onRowClick={(params) => setContatoIdEmEdicao(params.id)}
            sx={{
              '& .MuiDataGrid-root': {
                overflowY: 'auto', // Adiciona rolagem vertical
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
}
