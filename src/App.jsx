import { useState } from 'react';
import './App.css';

function App() {
  function toggleTheme() {
    var element = document.body;
    element.classList.toggle("dark-mode");
  }
  
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [estado, setEstado] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [cidade, setCidade] = useState('');
  const [cepError, setCepError] = useState('');
  const [enderecos, setEnderecos] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  async function handleCepChange(event) {
    const cepValue = event.target.value.replace(/\D/g, "");
    setCep(cepValue);
    setCepError('');
    setLogradouro('');
    setBairro('');
    setCidade('');
    setEstado('');
    
    if (cepValue.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setLogradouro(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setEstado(data.uf);
        } else {
          setCepError("CEP inválido. Verifique e tente novamente.");
        }
      } catch (error) {
        setCepError("Erro ao buscar CEP. Tente novamente mais tarde.");
        console.error("Erro ao buscar CEP:", error);
      }
    } else if (cepValue.length > 0) {
      setCepError("CEP inválido. Digite os 8 dígitos.");
    }
  }

  function handleForm(event) {
    event.preventDefault();
    if (cepError) return;

    const novoEndereco = {
      cep,
      bairro,
      estado,
      nome,
      email,
      logradouro,
      cidade
    };

    setEnderecos([...enderecos, novoEndereco]);
    setSuccessMessage("Cadastro realizado com sucesso!");
    
    setTimeout(() => setSuccessMessage(''), 3000);
  }

  return (
    <>
    <div id='container'>
      <form onSubmit={handleForm}>
        <h1>Cadastro de usuário</h1>
        Nome:
        <input type="text" name="name" id="name" onChange={(event) => setNome(event.target.value)} required />
        E-mail:
        <input type="email" name="email" id="email" onChange={(event) => setEmail(event.target.value)} required />
        CEP:
        <input type="text" name="cep" id="cep" onChange={handleCepChange} required maxLength="8" />
        {cepError && <p style={{ color: 'red' }}>{cepError}</p>}
        Rua:
        <input type="text" name="rua" id="rua" value={logradouro} readOnly />
        Bairro:
        <input type="text" name="bairro" id="bairro" value={bairro} readOnly />
        Cidade:
        <input type="text" name="cidade" id="cidade" value={cidade} readOnly />
        Estado:
        <input type="text" name="estado" id="estado" value={estado} readOnly />
        <div id='buttons'>
          <button type='submit' disabled={cepError}>Cadastrar</button>
          <button id='btn-reset' type='reset'>Limpar</button>
        </div>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>
      <button id='btn-theme' onClick={toggleTheme}>Mudar tema</button>
      
      {enderecos.length > 0 && (
        <div>
          <ul>
          <h2>Endereços cadastrados</h2>
            {enderecos.map((endereco, index) => (
              <li key={index}>Olá! Me chamo {endereco.nome}, e atualmente estou residindo no cep {endereco.cep}.</li>
            ))}
          </ul>
        </div>
      )}
      </div>
      © 2025 Victor Hugo, Created in RPV.
    </>
  );
}

export default App;
