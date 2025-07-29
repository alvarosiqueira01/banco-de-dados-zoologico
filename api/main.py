from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import mysql.connector
from mysql.connector import Error

# ---------- DATABASE CONNECTION ----------
def criar_conexao():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="admin_zoo",
            password="admin123",
            database="zoologico",
            port=3306
        )
        return conn
    except Error as e:
        print(f"Erro ao conectar ao MySQL: {e}")
        return None

# ---------- MODELS ----------
class AlimentoPorFornecedor(BaseModel):
    nome_alimento: str
    quantidade_kg: float

class EmailFuncionario(BaseModel):
    email: str

class RankingCuidador(BaseModel):
    nome: str
    animais_cuidados: int

class RankingFaxineiro(BaseModel):
    nome: str
    habitats_higienizados: int

class FuncionarioCreate(BaseModel):
    nome: str
    data_admissao: str  # ISO date: "2025-07-29"
    cpf: str
    email: str
    endereco: str

class HabitatCreate(BaseModel):
    nome: str
    tipo: str
    localizacao: str
    temp_media: float

class Habitat(BaseModel):
    id_habitat: int
    nome: str
    tipo: str
    localizacao: str
    temp_media: float

class FornecedorInfo(BaseModel):
    nome: str
    email: str
    telefone: str

# ---------- FASTAPI SETUP ----------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- ROTAS DE CONSULTA ----------

@app.get("/fornecedor/{id_fornecedor}/alimentos", response_model=List[AlimentoPorFornecedor])
def alimentos_por_fornecedor(id_fornecedor: int):
    conn = criar_conexao()
    if not conn:
        return []

    query = """
        SELECT p.nome, a.massa
        FROM Proporciona pr
        JOIN Produto p ON pr.id_produto = p.id_produto
        JOIN Alimento a ON p.id_produto = a.id_produto
        WHERE pr.id_fornecedor = %s;
    """
    cursor = conn.cursor()
    cursor.execute(query, (id_fornecedor,))
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return [{"nome_alimento": row[0], "quantidade_kg": float(row[1])} for row in results]


@app.get("/funcionarios/emails", response_model=List[EmailFuncionario])
def listar_emails_funcionarios():
    conn = criar_conexao()
    if not conn:
        return []

    query = "SELECT email FROM Funcionario;"
    cursor = conn.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return [{"email": row[0]} for row in results]


@app.get("/cuidadores/ranking", response_model=List[RankingCuidador])
def ranking_cuidadores():
    conn = criar_conexao()
    if not conn:
        return []

    query = """
        SELECT f.nome, COUNT(DISTINCT c.id_animal)
        FROM Cuida c
        JOIN Funcionario f ON c.id_funcionario = f.id_funcionario
        GROUP BY f.nome
        ORDER BY 2 DESC;
    """
    cursor = conn.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return [{"nome": row[0], "animais_cuidados": int(row[1])} for row in results]


@app.get("/faxineiros/ranking", response_model=List[RankingFaxineiro])
def ranking_faxineiros():
    conn = criar_conexao()
    if not conn:
        return []

    query = """
        SELECT f.nome, COUNT(DISTINCT h.id_habitat)
        FROM Higieniza h
        JOIN Funcionario f ON h.id_funcionario = f.id_funcionario
        GROUP BY f.nome
        ORDER BY 2 DESC;
    """
    cursor = conn.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    return [{"nome": row[0], "habitats_higienizados": int(row[1])} for row in results]

@app.get("/habitats", response_model=List[Habitat])
def listar_habitats():
    conn = criar_conexao()
    if not conn:
        print("[ERRO] Falha na conexão com o banco de dados.")
        return []

    query = "SELECT id_habitat, nome, tipo, localizacao, temp_media FROM Habitat;"
    cursor = conn.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    conn.close()

    print(f"[INFO] {len(results)} habitats retornados.")
    return [
        {
            "id_habitat": row[0],
            "nome": row[1],
            "tipo": row[2],
            "localizacao": row[3],
            "temp_media": float(row[4])
        } for row in results
    ]
# ---------- ROTAS DE INSERÇÃO ----------

@app.post("/funcionarios")
def adicionar_funcionario(dados: FuncionarioCreate):
    print("[DEBUG] Dados recebidos:", dados)

    conn = criar_conexao()
    if not conn:
        print("[ERRO] Falha na conexão com o banco de dados.")
        return {"mensagem": "Erro de conexão."}

    query = """
        INSERT INTO Funcionario (nome, data_admissao, cpf, email, endereco)
        VALUES (%s, %s, %s, %s, %s);
    """
    cursor = conn.cursor()

    try:
        print("[DEBUG] Executando query de inserção...")
        cursor.execute(query, (
            dados.nome,
            dados.data_admissao,
            dados.cpf,
            dados.email,
            dados.endereco
        ))
        conn.commit()
        print("[SUCESSO] Funcionário adicionado com sucesso.")

    except Error as e:
        print("[ERRO] Erro ao executar query:", e)
        return {"erro": str(e)}

    finally:
        cursor.close()
        conn.close()
        print("[INFO] Conexão com o banco de dados encerrada.")

    return {"mensagem": "Funcionário adicionado com sucesso Teste!"}

@app.post("/habitats")
def adicionar_habitat(dados: HabitatCreate):
    print("[DEBUG] Dados recebidos:", dados)
    
    conn = criar_conexao()
    if not conn:
        print("[ERROR] Falha na conexão com o banco de dados.")
        return {"mensagem": "Erro de conexão."}

    query = """
        INSERT INTO Habitat (nome, tipo, localizacao, temp_media)
        VALUES (%s, %s, %s, %s);
    """
    cursor = conn.cursor()
    try:
        print("[DEBUG] Executando query de inserção...")
        cursor.execute(query, (
            dados.nome,
            dados.tipo,
            dados.localizacao,
            dados.temp_media
        ))
        conn.commit()
        print("[DEBUG] Inserção realizada com sucesso.")
    except Error as e:
        print("[ERRO] Erro ao executar query:", e)
        return {"erro": str(e)}
    finally:
        cursor.close()
        conn.close()
        print("[INFO] Conexão com o banco de dados encerrada.")

    return {"mensagem": "Habitat adicionado com sucesso!"}


@app.get("/fornecedor/{id_fornecedor}/info", response_model=FornecedorInfo)
def info_fornecedor(id_fornecedor: int):
    conn = criar_conexao()
    if not conn:
        raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados.")

    query = """
        SELECT nome, email, telefone
        FROM Fornecedor
        WHERE id_fornecedor = %s;
    """
    cursor = conn.cursor()
    cursor.execute(query, (id_fornecedor,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()

    if not result:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado.")

    return {
        "nome": result[0],
        "email": result[1],
        "telefone": result[2]
    }


# ---------- ROOT ----------
@app.get("/")
def raiz():
    return {"mensagem": "API do Zoológico está rodando!"}
