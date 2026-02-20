-- Limpar todos os dados de áreas, subáreas e cargos
-- Execute no Supabase SQL Editor

-- 1. Primeiro, desvincular pessoas dos cargos (opcional - se quiser manter pessoas)
-- UPDATE pessoas SET cargo_id = NULL;

-- 2. Deletar cargos
DELETE FROM cargos;

-- 3. Deletar subáreas
DELETE FROM subareas;

-- 4. Deletar áreas (opcional - elas são fixas na estrutura T)
DELETE FROM areas;

-- 5. Recriar as 3 áreas principais (Aquisição, Entrega, Operação)
INSERT INTO areas (nome, posicao, descricao, ordem) VALUES
('Aquisição', 'esquerda', 'Processos de captação e aquisição de clientes', 1),
('Entrega', 'direita', 'Processos de entrega e execução de projetos', 2),
('Operação', 'baixo', 'Processos operacionais e suporte', 3);
