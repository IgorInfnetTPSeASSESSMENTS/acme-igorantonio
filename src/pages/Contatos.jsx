import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { regexEmail, regexNumerico } from "../infra/regex";
import { inserirContato, obterContato, excluirContato, listarContatos } from "../infra/contatos";

// eslint-disable-next-line react/prop-types
export default function Contatos({ fornecedorId }) {
  const [contatos, setContatos] = useState([]);
  const [contatoIdEmEdicao, setContatoIdEmEdicao] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredContatos = contatos.filter(contato =>
    contato.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: 'nome', headerName: 'Nome', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'fone', headerName: 'Telefone', flex: 1 },
  ];

  return (
    <>
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

        {/* Campo de busca */}
        <Box sx={{ marginTop: 4 }}>
          <TextField
            label="Buscar Contato"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Digite o nome do contato"
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
