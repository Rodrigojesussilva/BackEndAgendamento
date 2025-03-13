--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2025-03-13 20:17:03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 24601)
-- Name: Tb_Agendamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tb_Agendamento" (
    id integer NOT NULL,
    dthoraagendamento timestamp without time zone DEFAULT now(),
    dataatendimento date NOT NULL,
    horario time(0) without time zone NOT NULL,
    fk_usuario_id integer NOT NULL,
    fk_servico_id integer NOT NULL
);


ALTER TABLE public."Tb_Agendamento" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24608)
-- Name: Tb_Servico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tb_Servico" (
    id integer NOT NULL,
    tiposervico character varying(50) NOT NULL,
    valor numeric(18,0) NOT NULL
);


ALTER TABLE public."Tb_Servico" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24625)
-- Name: Tb_Usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tb_Usuario" (
    id integer NOT NULL,
    nome text NOT NULL,
    senha text NOT NULL,
    email text NOT NULL,
    "tipoUsuario" integer NOT NULL
);


ALTER TABLE public."Tb_Usuario" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24624)
-- Name: Tb_Usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Tb_Usuario_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Tb_Usuario_id_seq" OWNER TO postgres;

--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 219
-- Name: Tb_Usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Tb_Usuario_id_seq" OWNED BY public."Tb_Usuario".id;


--
-- TOC entry 215 (class 1259 OID 24600)
-- Name: tb_agendamento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tb_agendamento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tb_agendamento_id_seq OWNER TO postgres;

--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 215
-- Name: tb_agendamento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tb_agendamento_id_seq OWNED BY public."Tb_Agendamento".id;


--
-- TOC entry 217 (class 1259 OID 24607)
-- Name: tb_servico_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tb_servico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tb_servico_id_seq OWNER TO postgres;

--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 217
-- Name: tb_servico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tb_servico_id_seq OWNED BY public."Tb_Servico".id;


--
-- TOC entry 221 (class 1259 OID 24638)
-- Name: vw_agendamentos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_agendamentos AS
 SELECT a.id AS agendamento_id,
    a.dthoraagendamento,
    a.dataatendimento,
    a.horario,
    u.id AS usuario_id,
    u.nome AS usuario_nome,
    u.email AS usuario_email,
    u."tipoUsuario",
    s.id AS servico_id,
    s.tiposervico,
    s.valor
   FROM ((public."Tb_Agendamento" a
     LEFT JOIN public."Tb_Usuario" u ON ((a.fk_usuario_id = u.id)))
     LEFT JOIN public."Tb_Servico" s ON ((a.fk_servico_id = s.id)));


ALTER VIEW public.vw_agendamentos OWNER TO postgres;

--
-- TOC entry 4702 (class 2604 OID 24604)
-- Name: Tb_Agendamento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tb_Agendamento" ALTER COLUMN id SET DEFAULT nextval('public.tb_agendamento_id_seq'::regclass);


--
-- TOC entry 4704 (class 2604 OID 24611)
-- Name: Tb_Servico id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tb_Servico" ALTER COLUMN id SET DEFAULT nextval('public.tb_servico_id_seq'::regclass);


--
-- TOC entry 4705 (class 2604 OID 24628)
-- Name: Tb_Usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tb_Usuario" ALTER COLUMN id SET DEFAULT nextval('public."Tb_Usuario_id_seq"'::regclass);


--
-- TOC entry 4858 (class 0 OID 24601)
-- Dependencies: 216
-- Data for Name: Tb_Agendamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tb_Agendamento" (id, dthoraagendamento, dataatendimento, horario, fk_usuario_id, fk_servico_id) FROM stdin;
4	2025-03-06 15:00:00	2025-03-06	14:00:00	8	7
5	2025-03-06 18:00:00	2025-03-06	14:00:00	3	3
6	2025-03-06 18:00:00	2025-03-06	14:00:00	8	7
1	2025-03-06 10:00:00	2025-03-06	10:00:00	3	3
7	2025-03-06 18:00:00	2025-03-06	14:00:00	8	7
\.


--
-- TOC entry 4860 (class 0 OID 24608)
-- Dependencies: 218
-- Data for Name: Tb_Servico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tb_Servico" (id, tiposervico, valor) FROM stdin;
3	Manicure1	301
7	teste	123
\.


--
-- TOC entry 4862 (class 0 OID 24625)
-- Dependencies: 220
-- Data for Name: Tb_Usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tb_Usuario" (id, nome, senha, email, "tipoUsuario") FROM stdin;
3	Carlos Oliveira	1	rodrigo@gmail.com	1
8	João Silva	novaSenha123	joao.silva@example.com	0
\.


--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 219
-- Name: Tb_Usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Tb_Usuario_id_seq"', 8, true);


--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 215
-- Name: tb_agendamento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tb_agendamento_id_seq', 10, true);


--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 217
-- Name: tb_servico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tb_servico_id_seq', 7, true);


--
-- TOC entry 4711 (class 2606 OID 24632)
-- Name: Tb_Usuario Tb_Usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tb_Usuario"
    ADD CONSTRAINT "Tb_Usuario_pkey" PRIMARY KEY (id);


--
-- TOC entry 4707 (class 2606 OID 24606)
-- Name: Tb_Agendamento tb_agendamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tb_Agendamento"
    ADD CONSTRAINT tb_agendamento_pkey PRIMARY KEY (id);


--
-- TOC entry 4709 (class 2606 OID 24613)
-- Name: Tb_Servico tb_servico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tb_Servico"
    ADD CONSTRAINT tb_servico_pkey PRIMARY KEY (id);


--
-- TOC entry 4712 (class 2606 OID 24648)
-- Name: Tb_Agendamento fk_agendamento_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tb_Agendamento"
    ADD CONSTRAINT fk_agendamento_usuario FOREIGN KEY (fk_usuario_id) REFERENCES public."Tb_Usuario"(id) ON DELETE CASCADE;


-- Completed on 2025-03-13 20:17:04

--
-- PostgreSQL database dump complete
--

