import psycopg2
from psycopg2 import Error

# ==============================================================================
# FUNÇÃO DE CONEXÃO
# ==============================================================================
def criar_conexao(host, usuario, senha, banco):
    """Cria uma conexão com o banco de dados PostgreSQL."""
    conexao = None
    try:
        # Use psycopg2.connect e os parâmetros corretos (dbname, user, port, etc.)
        conexao = psycopg2.connect(
            host=host,
            user=usuario,
            password=senha,
            dbname=banco, # No psycopg2, o nome do banco é 'dbname'
            port="5432"   # Especifique a porta padrão do PostgreSQL
        )
        print("Conexão com o PostgreSQL bem-sucedida!")
    except Error as e:
        print(f"O erro '{e}' ocorreu ao tentar conectar.")
    return conexao

# ==============================================================================
# IMPLEMENTAÇÃO DAS CONSULTAS
# ==============================================================================
def consulta_1_alimentos_por_fornecedor(conn, id_fornecedor):
    """Consulta nome e quantidade de alimentos de um fornecedor específico. [cite: 9]"""
    if not conn or not conn.closed: return
    print(f"\n[CONSULTA 1] Alimentos fornecidos pelo fornecedor com ID {id_fornecedor}:")
    cursor = conn.cursor()
    # SQL da consulta 1 do documento
    query = """
        SELECT p.nome AS nome_alimento, a.massa AS quantidade_kg
        FROM Proporciona pr
        JOIN Produto p ON pr.id_produto = p.id_produto
        JOIN Alimento a ON p.id_produto = a.id_produto
        WHERE pr.id_fornecedor = %s;
    """ [cite: 10, 11, 12, 13, 14]
    try:
        cursor.execute(query, (id_fornecedor,))
        resultados = cursor.fetchall()
        for linha in resultados:
            print(f"- Alimento: {linha[0]}, Quantidade (kg): {linha[1]}") # [cite: 20, 21]
    except Error as e:
        print(f"O erro '{e}' ocorreu")
    finally:
        cursor.close()

def consulta_2_funcionarios_entrada_tardia(conn):
    """Consulta emails de funcionários que entraram após as 9:00h. [cite: 22]"""
    if not conn or not conn.closed: return
    print("\n[CONSULTA 2] Emails de funcionários que entraram após as 09:00:")
    cursor = conn.cursor()
    # SQL da consulta 2 do documento
    query = """
        SELECT f.email
        FROM Jornada j
        JOIN Funcionario f ON j.id_funcionario = f.id_funcionario
        WHERE j.hora_entrada > '09:00:00';
    """ [cite: 23, 24, 25, 26]
    try:
        cursor.execute(query)
        resultados = cursor.fetchall()
        for linha in resultados:
            print(f"- Email: {linha[0]}") # [cite: 29, 32, 34]
    except Error as e:
        print(f"O erro '{e}' ocorreu")
    finally:
        cursor.close()

def consulta_3_telefone_fornecedor_por_animal(conn, id_animal):
    """Consulta telefone do fornecedor do principal alimento de um animal. [cite: 35, 36]"""
    if not conn or not conn.closed: return
    print(f"\n[CONSULTA 3] Telefone do fornecedor principal para o animal com ID {id_animal}:")
    cursor = conn.cursor()
    # SQL da consulta 3 do documento
    query = """
        SELECT fo.telefone
        FROM Consome c
        JOIN Alimento a ON c.id_produto = a.id_produto
        JOIN Proporciona pr ON a.id_produto = pr.id_produto
        JOIN Fornecedor fo ON pr.id_fornecedor = fo.id_fornecedor
        WHERE c.id_animal = %s
        ORDER BY c.quantidade_consumida DESC
        LIMIT 1;
    """ [cite: 37, 38, 39, 40, 41, 42, 43]
    try:
        cursor.execute(query, (id_animal,))
        resultado = cursor.fetchone()
        if resultado:
            print(f"- Telefone: {resultado[0]}") # [cite: 47]
    except Error as e:
        print(f"O erro '{e}' ocorreu")
    finally:
        cursor.close()

def consulta_4_habitats_com_animais_medicados(conn):
    """Consulta habitats com animais que já receberam remédios. [cite: 48]"""
    if not conn or not conn.closed: return
    print("\n[CONSULTA 4] Habitats com animais que já foram medicados:")
    cursor = conn.cursor()
    # SQL da consulta 4 do documento
    query = """
        SELECT DISTINCT h.nome
        FROM Habitat h
        JOIN Animal a ON h.id_habitat = a.id_habitat
        WHERE EXISTS (
            SELECT 1
            FROM Prescreve p
            WHERE p.id_animal = a.id_animal
        );
    """ [cite: 49, 50, 51, 52, 53, 54, 55, 56]
    try:
        cursor.execute(query)
        resultados = cursor.fetchall()
        for linha in resultados:
            print(f"- Habitat: {linha[0]}")
    except Error as e:
        print(f"O erro '{e}' ocorreu")
    finally:
        cursor.close()

def consulta_5_cuidador_mais_ativo(conn):
    """Consulta o cuidador que cuidou do maior número de animais distintos. [cite: 58]"""
    if not conn or not conn.closed: return
    print("\n[CONSULTA 5] Cuidador com o maior número de animais diferentes cuidados:")
    cursor = conn.cursor()
    # SQL da consulta 5 do documento
    query = """
        SELECT f.nome, COUNT(DISTINCT c.id_animal) AS animais_cuidados
        FROM Cuida c
        JOIN Funcionario f ON f.id_funcionario = c.id_funcionario
        GROUP BY f.nome
        ORDER BY animais_cuidados DESC
        LIMIT 1;
    """ [cite: 59, 60, 61, 62, 63]
    try:
        cursor.execute(query)
        resultado = cursor.fetchone()
        if resultado:
            print(f"- Nome: {resultado[0]}, Animais Cuidados: {resultado[1]}") # [cite: 64]
    except Error as e:
        print(f"O erro '{e}' ocorreu")
    finally:
        cursor.close()

def consulta_6_ranking_faxineiros(conn):
    """Consulta os faxineiros em ordem decrescente de habitats higienizados. [cite: 65]"""
    if not conn or not conn.closed: return
    print("\n[CONSULTA 6] Ranking de faxineiros por número de habitats limpos:")
    cursor = conn.cursor()
    # SQL da consulta 6 do documento
    query = """
        SELECT f.nome, COUNT(DISTINCT h.id_habitat) AS habitats_higienizados
        FROM Higieniza h
        JOIN Funcionario f ON h.id_funcionario = f.id_funcionario
        GROUP BY f.nome
        ORDER BY habitats_higienizados DESC;
    """ [cite: 66, 67, 68, 69, 70]
    try:
        cursor.execute(query)
        resultados = cursor.fetchall()
        for linha in resultados:
            print(f"- Nome: {linha[0]:<15} | Habitats Higienizados: {linha[1]}") # [cite: 71]
    except Error as e:
        print(f"O erro '{e}' ocorreu")
    finally:
        cursor.close()

# ==============================================================================
# IMPLEMENTAÇÃO DAS VISÕES
# ==============================================================================
def ler_view_resumo_animal(conn):
    """Lê e exibe os dados da visão vw_resumo_animal. [cite: 74]"""
    if not conn or not conn.closed: return
    print("\n[VISÃO 1] Lendo dados da 'vw_resumo_animal':")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id_animal, nome_animal, especie, habitat, total_consumido FROM vw_resumo_animal;")
        resultados = cursor.fetchall()
        for linha in resultados:
            print(f"- ID: {linha[0]}, Animal: {linha[1]:<10}, Espécie: {linha[2]:<20}, Habitat: {linha[3]:<20}, Total Consumido: {linha[4]}")
    except Error as e:
        print(f"O erro '{e}' ocorreu. Verifique se a visão 'vw_resumo_animal' foi criada.")
    finally:
        cursor.close()

def ler_view_ranking_alimentos(conn):
    """Lê e exibe os dados da visão vw_ranking_alimentos_por_animal. [cite: 88]"""
    if not conn or not conn.closed: return
    print("\n[VISÃO 2] Lendo dados da 'vw_ranking_alimentos_por_animal':")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT nome_animal, alimento, fornecedor, quantidade_consumida FROM vw_ranking_alimentos_por_animal WHERE ranking_consumo = 1;")
        resultados = cursor.fetchall()
        for linha in resultados:
            print(f"- Animal: {linha[0]:<10}, Alimento Principal: {linha[1]:<18}, Fornecedor: {linha[2]:<22}, Qtd: {linha[3]}")
    except Error as e:
        print(f"O erro '{e}' ocorreu. Verifique se a visão 'vw_ranking_alimentos_por_animal' foi criada.")
    finally:
        cursor.close()

# ==============================================================================
# IMPLEMENTAÇÃO DO PROCEDURE E TRIGGER
# ==============================================================================
def chamar_procedure_inserir_animal(conn, nome, especie, sexo, dt_nasc, dt_entrada, peso, obs, id_hab):
    """Chama a procedure InserirAnimal para adicionar um novo animal. [cite: 292, 294]"""
    if not conn or not conn.closed: return
    print(f"\n[PROCEDURE] Tentando inserir o animal '{nome}'...")
    cursor = conn.cursor()
    # Argumentos para a procedure
    args = [nome, especie, sexo, dt_nasc, dt_entrada, peso, obs, id_hab]
    try:
        # Chama a procedure
        cursor.callproc('InserirAnimal', args)
        conn.commit()
        print(f"-> Sucesso! Animal '{nome}' inserido.") # [cite: 337]
    except Error as e:
        print(f"-> Erro esperado! O banco de dados retornou: {e}") # [cite: 355]
    finally:
        cursor.close()

def testar_trigger_update_produto(conn, id_produto, nova_quantidade):
    """Tenta atualizar a quantidade de um produto para testar o gatilho. [cite: 319, 322]"""
    if not conn or not conn.closed: return
    print(f"\n[TRIGGER] Tentando atualizar produto ID {id_produto} para a quantidade {nova_quantidade}...")
    cursor = conn.cursor()
    query = "UPDATE Produto SET quantidade = %s WHERE id_produto = %s;"
    try:
        cursor.execute(query, (nova_quantidade, id_produto))
        conn.commit()
        print(f"-> Sucesso! Quantidade do produto {id_produto} atualizada.") # [cite: 377]
    except Error as e:
        print(f"-> Erro esperado! O gatilho impediu a operação: {e}") # [cite: 387]
    finally:
        cursor.close()


# ==============================================================================
# EXECUÇÃO PRINCIPAL
# ==============================================================================
def main():
    """Função principal para executar todas as operações no banco."""
    # USE O USUÁRIO 'admin_zoo' PARA TER TODAS AS PERMISSÕES
    conexao = criar_conexao("localhost", "admin_zoo", "admin123", "trabalho_bd")

    if conexao and not conexao.closed:
        print("\n--- EXECUTANDO CONSULTAS ---")
        consulta_1_alimentos_por_fornecedor(conexao, 5) # [cite: 14]
        consulta_2_funcionarios_entrada_tardia(conexao)
        consulta_3_telefone_fornecedor_por_animal(conexao, 4) # [cite: 42]
        consulta_4_habitats_com_animais_medicados(conexao)
        consulta_5_cuidador_mais_ativo(conexao)
        consulta_6_ranking_faxineiros(conexao)

        print("\n\n--- LENDO DADOS DAS VISÕES ---")
        ler_view_resumo_animal(conexao)
        ler_view_ranking_alimentos(conexao)

        print("\n\n--- EXECUTANDO PROCEDURE E TESTANDO TRIGGER ---")
        # Teste de sucesso da Procedure [cite: 337]
        chamar_procedure_inserir_animal(conexao, 'Kion', 'Panthera leo', 'M', '2024-05-10', '2025-07-28', 150.5, 'Filho de Simba', 1)

        # Teste de erro da Procedure [cite: 355]
        chamar_procedure_inserir_animal(conexao, 'Babu', 'Ursus arctos', 'M', '2024-01-10', '2025-02-01', 300.0, 'Habitat inexistente', 99)
        
        # Teste de sucesso do Trigger [cite: 377]
        testar_trigger_update_produto(conexao, 1, 80)
        
        # Teste de erro do Trigger [cite: 387]
        testar_trigger_update_produto(conexao, 1, -10)
        
        # Fechar a conexão
        conexao.close()
        print("\n\n>>> Conexão com o MySQL foi fechada.")

if __name__ == '__main__':
    main()