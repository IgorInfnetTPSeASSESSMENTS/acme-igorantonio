import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { regexEmail, regexNumerico } from "../infra/regex";
import { inserirContato, obterContato, excluirContato, listarContatos } from "../infra/contatos";
import { BackButton, FixedBox, NavbarComponent } from "../components";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Contatos({ buttons }) {
  const [contatos, setContatos] = useState([]);
  const [contatoIdEmEdicao, setContatoIdEmEdicao] = useState("");
  const { fornecedorId } = useParams(); // Captura o ID do fornecedor da URL
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const { user } = useAuth();

  const userEmail = user ? user.email : '';

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

  const columns = [
    { field: 'nome', headerName: 'Nome', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'fone', headerName: 'Telefone', flex: 1 },
  ];

  return (
    <>
      <NavbarComponent buttons={buttons} userEmail={userEmail} />
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom sx={{marginBottom: 3}}>Cadastro de Contatos</Typography>
        <Box component="form" onSubmit={handleSubmit(submeterDados)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome"
            {...register('nome', {
              required: 'Nome é obrigatório',
              minLength: { value: 5, message: 'Nome deve ter pelo menos 5 caracteres' },
              maxLength: { value: 50, message: 'Nome deve ter até 50 caracteres' },
            })}
            error={!!errors.nome}
            helperText={errors.nome?.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Email"
            {...register('email', {
              required: 'Email é obrigatório',
              minLength: { value: 5, message: 'Email deve ter pelo menos 5 caracteres' },
              maxLength: { value: 30, message: 'Email deve ter até 30 caracteres' },
              pattern: { value: regexEmail, message: 'Email inválido' },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Telefone"
            {...register('fone', {
              required: 'Telefone é obrigatório',
              minLength: { value: 8, message: 'Telefone deve ter pelo menos 8 dígitos' },
              pattern: { value: regexNumerico, message: 'Telefone deve ser numérico' },
            })}
            error={!!errors.fone}
            helperText={errors.fone?.message}
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" type="submit">Salvar</Button>
            <Button variant="contained" color="error" type="button" onClick={handleExcluir} disabled={!contatoIdEmEdicao}>Excluir</Button>
          </Box>
        </Box>

        <Box sx={{ marginTop: 4 }}>
          <DataGrid
            rows={contatos}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
            disableSelectionOnClick
            onRowClick={(params) => setContatoIdEmEdicao(params.id)}
          />
        </Box>
        <FixedBox><BackButton></BackButton></FixedBox>
      </Box>
    </>
  );
}
