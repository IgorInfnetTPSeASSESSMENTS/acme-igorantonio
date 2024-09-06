import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { excluirFornecedor, inserirFornecedor, listarFornecedores, obterFornecedor } from "../infra/fornecedores";
import { Box, Button, TextField, Typography, Checkbox, Modal, IconButton } from "@mui/material";
import { regexEmail, regexNumerico } from "../infra/regex";
import { DataGrid } from "@mui/x-data-grid";
import { NavbarComponent } from "../components";
import { useAuth } from "../contexts/AuthContext";
import Contatos from "./Contatos"; // Importe o componente Contatos
import CloseIcon from '@mui/icons-material/Close'; // Importe o ícone de fechamento

// eslint-disable-next-line react/prop-types
export default function Fornecedores({ buttons }) {
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedoresFiltrados, setFornecedoresFiltrados] = useState([]);
  const [idEmEdicao, setIdEmEdicao] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [fornecedorIdSelecionado, setFornecedorIdSelecionado] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const { user } = useAuth();

  const userEmail = user ? user.email : '';

  useEffect(() => {
    async function fetchFornecedores() {
      try {
        const fornecedores = await listarFornecedores();
        const fornecedoresComProdutos = fornecedores.map(fornecedor => ({
          ...fornecedor,
          produtos: fornecedor.produtos ? fornecedor.produtos.join(", ") : "N/A",
        }));
        setFornecedores(fornecedoresComProdutos);
        setFornecedoresFiltrados(fornecedoresComProdutos); // Inicialmente, mostra todos os fornecedores
      } catch (error) {
        console.error('Erro ao listar fornecedores:', error);
      }
    }
    fetchFornecedores();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (idEmEdicao) {
        try {
          const fornecedor = await obterFornecedor(idEmEdicao);
          setValue('nome', fornecedor.nome);
          setValue('email', fornecedor.email);
          setValue('fone', fornecedor.fone);
          setValue('endereco', fornecedor.endereco);
          setValue('produtos', fornecedor.produtos ? fornecedor.produtos.join(', ') : '');
        } catch (error) {
          console.error('Erro ao obter fornecedor:', error);
        }
      } else {
        reset();
      }
    }
    fetchData();
  }, [idEmEdicao, reset, setValue]);

  async function submeterDados(dados) {
    try {
      dados.produtos = dados.produtos
        ? dados.produtos.split(',').map(produto => produto.trim()).filter(produto => produto)
        : [];
      await inserirFornecedor(dados);
      reset();
      atualizarListaFornecedores();
      setIdEmEdicao('');
    } catch (error) {
      console.error('Erro ao submeter dados:', error);
    }
  }

  async function handleExcluir() {
    try {
      await excluirFornecedor(idEmEdicao);
      atualizarListaFornecedores();
      setIdEmEdicao('');
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
    }
  }

  async function atualizarListaFornecedores() {
    try {
      const fornecedoresAtualizados = await listarFornecedores();
      const fornecedoresComProdutos = fornecedoresAtualizados.map(fornecedor => ({
        ...fornecedor,
        produtos: fornecedor.produtos ? fornecedor.produtos.join(", ") : "N/A",
      }));
      setFornecedores(fornecedoresComProdutos);
      setFornecedoresFiltrados(fornecedoresComProdutos); // Atualiza a lista filtrada
    } catch (error) {
      console.error('Erro ao atualizar lista de fornecedores:', error);
    }
  }

  const handleCheckboxChange = (fornecedorId) => {
    setFornecedorIdSelecionado(fornecedorId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFornecedorIdSelecionado(null);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const fornecedoresFiltrados = fornecedores.filter(fornecedor =>
      fornecedor.nome.toLowerCase().includes(searchValue)
    );
    setFornecedoresFiltrados(fornecedoresFiltrados);
  };

  const columns = [
    { field: 'nome', headerName: 'Nome', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'fone', headerName: 'Telefone', flex: 1 },
    { field: 'endereco', headerName: 'Endereço', flex: 1 },
    { field: 'produtos', headerName: 'Produtos Fornecidos', flex: 1 },
    {
      field: 'actions',
      headerName: 'Contatos',
      renderCell: (params) => (
        <Checkbox
          checked={params.row.id === fornecedorIdSelecionado}
          onChange={() => handleCheckboxChange(params.id)}
        />
      ),
      width: 150,
    }
  ];

  return (
    <>
      <NavbarComponent buttons={buttons} userEmail={userEmail} />
      <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{ padding: 4, width: '70%'}}>
          <Typography variant="h4" gutterBottom sx={{ marginBottom: 3 }}>Cadastro de Fornecedores</Typography>
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
            <TextField
              label="Endereço"
              {...register('endereco', {
                required: 'Endereço é obrigatório',
                minLength: { value: 10, message: 'Endereço deve ter pelo menos 10 caracteres' },
                maxLength: { value: 100, message: 'Endereço deve ter até 100 caracteres' },
              })}
              error={!!errors.endereco}
              helperText={errors.endereco?.message}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Produtos Fornecidos"
              {...register('produtos', {
                required: 'Produtos são obrigatórios',
                minLength: { value: 3, message: 'Produtos devem ter pelo menos 3 caracteres' },
              })}
              placeholder="Produto1, Produto2, Produto3"
              error={!!errors.produtos}
              helperText={errors.produtos?.message}
              InputLabelProps={{ shrink: true }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary" type="submit">Salvar</Button>
              <Button variant="contained" color="error" type="button" onClick={handleExcluir} disabled={!idEmEdicao}>Excluir</Button>
            </Box>
          </Box>

          <Box>
          <TextField
            label="Buscar Fornecedor"
            onChange={handleSearchChange}
            sx={{ marginTop: 4, marginBottom: 2 }}
            placeholder="Digite o nome do fornecedor"
            InputLabelProps={{ shrink: true }}
          />
          </Box>

          <Box sx={{ marginTop: 2, height: 400 }}>
            <DataGrid
              rows={fornecedoresFiltrados}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              onRowClick={(params) => setIdEmEdicao(params.id)}
              getRowId={(row) => row.id}
              sx={{
                '& .MuiDataGrid-root': {
                  overflowY: 'auto', // Adiciona rolagem vertical
                },
              }}
            />
          </Box>
        </Box>
      </Box>
          {/* Modal para cadastro de contatos */}
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{
              padding: 4,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              width: '50%',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}>
              <IconButton
                sx={{ position: 'absolute', top: 10, right: 10 }}
                onClick={handleCloseModal}
              >
                <CloseIcon />
              </IconButton>
              {fornecedorIdSelecionado && <Contatos fornecedorId={fornecedorIdSelecionado} />}
            </Box>
          </Modal>
    </>
  );
}
