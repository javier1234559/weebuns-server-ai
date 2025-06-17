--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9 (Homebrew)

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: timescaledb; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS timescaledb WITH SCHEMA public;


--
-- Name: EXTENSION timescaledb; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION timescaledb IS 'Enables scalable inserts and complex queries for time-series data (Apache 2 Edition)';


--
-- Name: AuthProvider; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AuthProvider" AS ENUM (
    'local',
    'google',
    'facebook'
);


ALTER TYPE public."AuthProvider" OWNER TO neondb_owner;

--
-- Name: ContentStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ContentStatus" AS ENUM (
    'draft',
    'published',
    'private',
    'deleted',
    'pending'
);


ALTER TYPE public."ContentStatus" OWNER TO neondb_owner;

--
-- Name: LessonType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."LessonType" AS ENUM (
    'practice',
    'test'
);


ALTER TYPE public."LessonType" OWNER TO neondb_owner;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."NotificationType" AS ENUM (
    'system',
    'advertisement',
    'submission',
    'comment_reply',
    'comment_mention'
);


ALTER TYPE public."NotificationType" OWNER TO neondb_owner;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);


ALTER TYPE public."PaymentStatus" OWNER TO neondb_owner;

--
-- Name: PaymentType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."PaymentType" AS ENUM (
    'bank',
    'momo',
    'zalopay',
    'internal'
);


ALTER TYPE public."PaymentType" OWNER TO neondb_owner;

--
-- Name: ReactionType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ReactionType" AS ENUM (
    'like',
    'teacher_heart'
);


ALTER TYPE public."ReactionType" OWNER TO neondb_owner;

--
-- Name: SkillType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."SkillType" AS ENUM (
    'listening',
    'reading',
    'writing',
    'speaking'
);


ALTER TYPE public."SkillType" OWNER TO neondb_owner;

--
-- Name: SubmissionStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."SubmissionStatus" AS ENUM (
    'draft',
    'submitted',
    'taken',
    'scored'
);


ALTER TYPE public."SubmissionStatus" OWNER TO neondb_owner;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."UserRole" AS ENUM (
    'user',
    'admin',
    'teacher'
);


ALTER TYPE public."UserRole" OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Banner; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Banner" (
    id uuid NOT NULL,
    title text NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    "imageUrl" text NOT NULL,
    "actionLink" text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Banner" OWNER TO neondb_owner;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Comment" (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    parent_id uuid,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    "lessonSubmissionId" uuid,
    identifier_id text NOT NULL,
    action_link text
);


ALTER TABLE public."Comment" OWNER TO neondb_owner;

--
-- Name: Lesson; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Lesson" (
    id uuid NOT NULL,
    skill public."SkillType" NOT NULL,
    title text NOT NULL,
    description text,
    "lessonType" public."LessonType" NOT NULL,
    level_code text NOT NULL,
    topic_code text NOT NULL,
    time_limit integer,
    content jsonb NOT NULL,
    thumbnail_url text,
    tags text[] DEFAULT ARRAY[]::text[],
    status public."ContentStatus" DEFAULT 'draft'::public."ContentStatus" NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public."Lesson" OWNER TO neondb_owner;

--
-- Name: LessonSubmission; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LessonSubmission" (
    id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    user_id uuid NOT NULL,
    submission_type public."SkillType" DEFAULT 'writing'::public."SkillType" NOT NULL,
    status public."SubmissionStatus" DEFAULT 'draft'::public."SubmissionStatus" NOT NULL,
    content jsonb,
    feedback jsonb,
    tokens_used integer DEFAULT 0 NOT NULL,
    submitted_at timestamp(3) without time zone,
    graded_at timestamp(3) without time zone,
    graded_by uuid,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public."LessonSubmission" OWNER TO neondb_owner;

--
-- Name: User; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."User" (
    id uuid NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role public."UserRole" DEFAULT 'user'::public."UserRole" NOT NULL,
    auth_provider public."AuthProvider" DEFAULT 'local'::public."AuthProvider" NOT NULL,
    auth_provider_id text,
    first_name text,
    last_name text,
    profile_picture text,
    is_email_verified boolean DEFAULT false NOT NULL,
    last_login timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    bio text
);


ALTER TABLE public."User" OWNER TO neondb_owner;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO neondb_owner;

--
-- Name: comment_reaction; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.comment_reaction (
    id uuid NOT NULL,
    comment_id uuid NOT NULL,
    user_id uuid NOT NULL,
    type public."ReactionType" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comment_reaction OWNER TO neondb_owner;

--
-- Name: notification; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notification (
    id uuid NOT NULL,
    type public."NotificationType" NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    thumbnail_url text,
    action_url text,
    is_global boolean DEFAULT false NOT NULL,
    user_id uuid,
    is_read boolean DEFAULT false NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp(3) without time zone
);


ALTER TABLE public.notification OWNER TO neondb_owner;

--
-- Name: reference_data; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reference_data (
    id uuid NOT NULL,
    type text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    metadata jsonb,
    is_active boolean DEFAULT true NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.reference_data OWNER TO neondb_owner;

--
-- Name: student_profile; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.student_profile (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    target_study_duration integer,
    target_reading double precision,
    target_listening double precision,
    target_writing double precision,
    target_speaking double precision,
    next_exam_date timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.student_profile OWNER TO neondb_owner;

--
-- Name: study_activity; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.study_activity (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    activity_date timestamp(3) without time zone NOT NULL,
    reading integer DEFAULT 0 NOT NULL,
    listening integer DEFAULT 0 NOT NULL,
    writing integer DEFAULT 0 NOT NULL,
    speaking integer DEFAULT 0 NOT NULL,
    total_minutes integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.study_activity OWNER TO neondb_owner;

--
-- Name: teacher_profile; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_profile (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    teaching_experience text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    certifications text,
    intro_video_url_embed text,
    long_bio text,
    other text,
    bankingqr_image_url text
);


ALTER TABLE public.teacher_profile OWNER TO neondb_owner;

--
-- Name: token_package; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.token_package (
    id uuid NOT NULL,
    name text NOT NULL,
    tokens integer NOT NULL,
    price_vnd integer NOT NULL,
    price_per_token integer NOT NULL,
    old_price_per_token integer,
    message text,
    popular boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    code text NOT NULL
);


ALTER TABLE public.token_package OWNER TO neondb_owner;

--
-- Name: token_wallet; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.token_wallet (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    balance integer DEFAULT 0 NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.token_wallet OWNER TO neondb_owner;

--
-- Name: transaction; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.transaction (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    package_id uuid,
    amount_vnd integer NOT NULL,
    token_amount integer NOT NULL,
    "paymentType" public."PaymentType" NOT NULL,
    transaction_id text NOT NULL,
    status public."PaymentStatus" NOT NULL,
    payment_date timestamp(3) without time zone NOT NULL,
    currency text DEFAULT 'VND'::text NOT NULL,
    transaction_type text NOT NULL,
    reason text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.transaction OWNER TO neondb_owner;

--
-- Name: vocabulary; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.vocabulary (
    id uuid NOT NULL,
    term text NOT NULL,
    meaning text[],
    example_sentence text,
    image_url text,
    reference_link text,
    reference_name text,
    repetition_level integer DEFAULT 0 NOT NULL,
    next_review timestamp(3) without time zone,
    created_by uuid NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.vocabulary OWNER TO neondb_owner;

--
-- Name: vocabulary_practice; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.vocabulary_practice (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    vocabulary_id uuid NOT NULL,
    success_rate double precision,
    last_practiced timestamp(3) without time zone,
    next_review timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.vocabulary_practice OWNER TO neondb_owner;

--
-- Data for Name: cache_inval_bgw_job; Type: TABLE DATA; Schema: _timescaledb_cache; Owner: cloud_admin
--

COPY _timescaledb_cache.cache_inval_bgw_job  FROM stdin;
\.


--
-- Data for Name: cache_inval_extension; Type: TABLE DATA; Schema: _timescaledb_cache; Owner: cloud_admin
--

COPY _timescaledb_cache.cache_inval_extension  FROM stdin;
\.


--
-- Data for Name: cache_inval_hypertable; Type: TABLE DATA; Schema: _timescaledb_cache; Owner: cloud_admin
--

COPY _timescaledb_cache.cache_inval_hypertable  FROM stdin;
\.


--
-- Data for Name: hypertable; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.hypertable (id, schema_name, table_name, associated_schema_name, associated_table_prefix, num_dimensions, chunk_sizing_func_schema, chunk_sizing_func_name, chunk_target_size, compression_state, compressed_hypertable_id, replication_factor, status) FROM stdin;
\.


--
-- Data for Name: chunk; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.chunk (id, hypertable_id, schema_name, table_name, compressed_chunk_id, dropped, status, osm_chunk, creation_time) FROM stdin;
\.


--
-- Data for Name: dimension; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.dimension (id, hypertable_id, column_name, column_type, aligned, num_slices, partitioning_func_schema, partitioning_func, interval_length, compress_interval_length, integer_now_func_schema, integer_now_func) FROM stdin;
\.


--
-- Data for Name: dimension_slice; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.dimension_slice (id, dimension_id, range_start, range_end) FROM stdin;
\.


--
-- Data for Name: chunk_constraint; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.chunk_constraint (chunk_id, dimension_slice_id, constraint_name, hypertable_constraint_name) FROM stdin;
\.


--
-- Data for Name: chunk_data_node; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.chunk_data_node (chunk_id, node_chunk_id, node_name) FROM stdin;
\.


--
-- Data for Name: chunk_index; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.chunk_index (chunk_id, index_name, hypertable_id, hypertable_index_name) FROM stdin;
\.


--
-- Data for Name: compression_chunk_size; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.compression_chunk_size (chunk_id, compressed_chunk_id, uncompressed_heap_size, uncompressed_toast_size, uncompressed_index_size, compressed_heap_size, compressed_toast_size, compressed_index_size, numrows_pre_compression, numrows_post_compression, numrows_frozen_immediately) FROM stdin;
\.


--
-- Data for Name: continuous_agg; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.continuous_agg (mat_hypertable_id, raw_hypertable_id, parent_mat_hypertable_id, user_view_schema, user_view_name, partial_view_schema, partial_view_name, bucket_width, direct_view_schema, direct_view_name, materialized_only, finalized) FROM stdin;
\.


--
-- Data for Name: continuous_agg_migrate_plan; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.continuous_agg_migrate_plan (mat_hypertable_id, start_ts, end_ts, user_view_definition) FROM stdin;
\.


--
-- Data for Name: continuous_agg_migrate_plan_step; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.continuous_agg_migrate_plan_step (mat_hypertable_id, step_id, status, start_ts, end_ts, type, config) FROM stdin;
\.


--
-- Data for Name: continuous_aggs_bucket_function; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.continuous_aggs_bucket_function (mat_hypertable_id, experimental, name, bucket_width, origin, timezone) FROM stdin;
\.


--
-- Data for Name: continuous_aggs_hypertable_invalidation_log; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.continuous_aggs_hypertable_invalidation_log (hypertable_id, lowest_modified_value, greatest_modified_value) FROM stdin;
\.


--
-- Data for Name: continuous_aggs_invalidation_threshold; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.continuous_aggs_invalidation_threshold (hypertable_id, watermark) FROM stdin;
\.


--
-- Data for Name: continuous_aggs_materialization_invalidation_log; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.continuous_aggs_materialization_invalidation_log (materialization_id, lowest_modified_value, greatest_modified_value) FROM stdin;
\.


--
-- Data for Name: continuous_aggs_watermark; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.continuous_aggs_watermark (mat_hypertable_id, watermark) FROM stdin;
\.


--
-- Data for Name: dimension_partition; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.dimension_partition (dimension_id, range_start, data_nodes) FROM stdin;
\.


--
-- Data for Name: hypertable_compression; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.hypertable_compression (hypertable_id, attname, compression_algorithm_id, segmentby_column_index, orderby_column_index, orderby_asc, orderby_nullsfirst) FROM stdin;
\.


--
-- Data for Name: hypertable_data_node; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.hypertable_data_node (hypertable_id, node_hypertable_id, node_name, block_chunks) FROM stdin;
\.


--
-- Data for Name: metadata; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.metadata (key, value, include_in_telemetry) FROM stdin;
\.


--
-- Data for Name: remote_txn; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.remote_txn (data_node_name, remote_transaction_id) FROM stdin;
\.


--
-- Data for Name: tablespace; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: cloud_admin
--

COPY _timescaledb_catalog.tablespace (id, hypertable_id, tablespace_name) FROM stdin;
\.


--
-- Data for Name: bgw_job; Type: TABLE DATA; Schema: _timescaledb_config; Owner: cloud_admin
--

COPY _timescaledb_config.bgw_job (id, application_name, schedule_interval, max_runtime, max_retries, retry_period, proc_schema, proc_name, owner, scheduled, fixed_schedule, initial_start, hypertable_id, config, check_schema, check_name, timezone) FROM stdin;
\.


--
-- Data for Name: job_errors; Type: TABLE DATA; Schema: _timescaledb_internal; Owner: cloud_admin
--

COPY _timescaledb_internal.job_errors (job_id, pid, start_time, finish_time, error_data) FROM stdin;
2	931	2025-05-22 14:34:50.017484+00	2025-05-22 14:34:50.028933+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	5862	2025-05-22 15:35:18.1546+00	2025-05-22 15:35:18.160544+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	1930	2025-05-22 17:44:40.660847+00	2025-05-22 17:44:40.666601+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	660	2025-05-23 02:27:26.801542+00	2025-05-23 02:27:26.809554+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	605	2025-05-23 11:08:13.709862+00	2025-05-23 11:08:13.716893+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	659	2025-05-24 06:33:08.924769+00	2025-05-24 06:33:08.932684+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	635	2025-05-25 07:51:54.571725+00	2025-05-25 07:51:54.620456+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	652	2025-05-26 17:12:34.81519+00	2025-05-26 17:12:34.917021+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	542	2025-05-27 09:32:02.842264+00	2025-05-27 09:32:02.849303+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	951	2025-05-27 17:45:38.475446+00	2025-05-27 17:45:38.485928+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	565	2025-05-28 04:32:36.929125+00	2025-05-28 04:32:36.970272+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	753	2025-05-29 04:04:10.273749+00	2025-05-29 04:04:10.348639+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	772	2025-06-01 07:57:26.015526+00	2025-06-01 07:57:26.121568+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	728	2025-06-02 07:32:21.935236+00	2025-06-02 07:32:22.019134+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	666	2025-06-03 12:33:37.566506+00	2025-06-03 12:33:37.618249+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	1031	2025-06-04 05:05:46.945804+00	2025-06-04 05:05:47.082832+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	611	2025-06-05 02:20:25.337138+00	2025-06-05 02:20:25.428293+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	575	2025-06-06 07:35:49.731058+00	2025-06-06 07:35:49.788155+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	744	2025-06-07 05:29:02.59488+00	2025-06-07 05:29:02.603718+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	775	2025-06-08 01:52:22.121523+00	2025-06-08 01:52:22.12866+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	754	2025-06-09 08:55:11.03263+00	2025-06-09 08:55:11.041002+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	744	2025-06-10 08:04:40.071917+00	2025-06-10 08:04:40.080172+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	770	2025-06-11 13:48:26.054284+00	2025-06-11 13:48:26.062226+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	1337	2025-06-12 10:25:56.0669+00	2025-06-12 10:25:56.075857+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	620	2025-06-13 07:22:29.171753+00	2025-06-13 07:22:29.179436+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	823	2025-06-14 04:43:08.366994+00	2025-06-14 04:43:08.374743+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	833	2025-06-15 09:08:42.591437+00	2025-06-15 09:08:42.600836+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	884	2025-06-16 03:30:35.994786+00	2025-06-16 03:30:36.004848+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
2	919	2025-06-17 04:16:06.014021+00	2025-06-17 04:16:06.073267+00	{"hint": "To access all features and the best time-series experience, try out Timescale Cloud.", "domain": "postgres-16", "lineno": 166, "message": "functionality not supported under the current \\"apache\\" license. Learn more at https://timescale.com/.", "filename": "cross_module_fn.c", "funcname": "error_no_default_fn_community", "proc_name": "policy_job_error_retention", "sqlerrcode": "0A000", "proc_schema": "_timescaledb_functions", "context_domain": "postgres-16"}
\.


--
-- Data for Name: Banner; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Banner" (id, title, order_index, "imageUrl", "actionLink", created_at, updated_at) FROM stdin;
cccfc930-b1b8-4a4f-875f-f6c060a74a36	Tạp Chí Giải Đề	2	https://cms.youpass.vn/assets/2391ddd1-deb2-451e-b1d1-c2f519badba2?width=1000	https://ielts1984.vn/ielts-insights	2025-06-12 19:44:54.102	2025-06-12 19:44:54.102
45d4ca61-7960-4cd4-a101-6f0e0bd2a85e	Nghệ thuật writing	2	https://cms.youpass.vn/assets/b72096f2-117a-4021-9662-91771c3bb03e?width=1500	https://ielts1984.vn/ielts-insights	2025-06-12 19:59:07.183	2025-06-12 19:59:30.871
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Comment" (id, user_id, content, parent_id, created_at, updated_at, deleted_at, "lessonSubmissionId", identifier_id, action_link) FROM stdin;
1293e8cd-9632-47e8-8570-db6cfb954415	56bb530c-d276-4b58-9d2b-bf3b15d034d8	Bài viết này rất hữu ích, cảm ơn tác giả!	\N	2025-05-22 14:45:57.439	2025-05-22 14:45:57.439	\N	\N	writingAll	\N
0366054e-4f61-4178-b475-ad88f585be22	56bb530c-d276-4b58-9d2b-bf3b15d034d8	Tôi cũng thấy bài viết này rất hay!	1293e8cd-9632-47e8-8570-db6cfb954415	2025-05-22 14:45:57.502	2025-05-22 14:45:57.502	\N	\N	writingAll	\N
bbc8aff4-f7ca-42de-873f-8986ff2489ac	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	xin chao	\N	2025-05-23 05:22:26.057	2025-05-23 05:22:26.057	\N	\N	speakingDetail_b365942d-b625-4bfd-8f2e-394dcfc5fb48	\N
7a14968a-ace0-424f-b7e0-3d311928fec1	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	Bai viet em co hay khong co!	\N	2025-05-23 05:38:31.846	2025-05-23 05:38:31.846	\N	\N	writingResult_86e747e3-3f19-40cb-a93d-55ad77bf4122	\N
250b1d81-c38a-4b4b-96fe-4c3a7524dc22	56bb530c-d276-4b58-9d2b-bf3b15d034d8	Ok em	\N	2025-05-25 08:16:55.057	2025-05-25 08:16:55.057	\N	\N	writingResult_86e747e3-3f19-40cb-a93d-55ad77bf4122	\N
5cb4fba8-6025-4a17-885b-08ea6a84a394	56bb530c-d276-4b58-9d2b-bf3b15d034d8	Chủ đề này học được nhiều từ vựng mới phết	\N	2025-05-28 12:49:26.213	2025-05-28 12:49:26.213	\N	\N	speakingDetail_b365942d-b625-4bfd-8f2e-394dcfc5fb48	\N
016cbcbd-4890-46da-b8fd-69ec599277e3	e092ff43-54a2-4b16-986f-b0474630bc34	XIN CHÀO	\N	2025-06-06 08:12:43.817	2025-06-06 08:12:43.817	\N	\N	writingDetail_ec721b8c-4cbe-439d-b789-5c65e19f5e7f	\N
40f723e5-7986-43ea-a3dc-91403bfe8d4b	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	Câu này em sai ở đâu vậy	\N	2025-06-12 15:57:05.107	2025-06-12 15:57:05.107	\N	\N	writingResult_86e747e3-3f19-40cb-a93d-55ad77bf4122	\N
da373102-e4bf-49bb-85af-09e92101bdb0	50285181-4b29-40cb-9c9c-fde1b1491419	Ok	\N	2025-06-12 20:24:12.389	2025-06-12 20:24:12.389	\N	\N	writingResult_86e747e3-3f19-40cb-a93d-55ad77bf4122	\N
944ccb34-2990-476d-96f3-c68e5b939f5b	c817735c-513c-4453-9e6e-9e9d7f25ab4c	Bai nay em chua hieu	\N	2025-06-16 10:26:00.509	2025-06-16 10:26:00.509	\N	\N	writingResult_86e747e3-3f19-40cb-a93d-55ad77bf4122	https://www.waebuns.com/lesson/writing/86e747e3-3f19-40cb-a93d-55ad77bf4122/result?submissionId=9fae6136-fe8f-4a6d-8707-aba4e48d78b4
9f42497e-e62f-46d8-a802-b441fc97f9f0	50285181-4b29-40cb-9c9c-fde1b1491419	Hallo cô	\N	2025-06-17 14:22:55.51	2025-06-17 14:22:55.51	\N	\N	writingResult_47924493-75ce-4050-9a96-9f3b85af70df	http://localhost:3001/lesson/writing/86e747e3-3f19-40cb-a93d-55ad77bf4122/result?submissionId=47924493-75ce-4050-9a96-9f3b85af70df
\.


--
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Lesson" (id, skill, title, description, "lessonType", level_code, topic_code, time_limit, content, thumbnail_url, tags, status, created_by, created_at, updated_at, deleted_at) FROM stdin;
b365942d-b625-4bfd-8f2e-394dcfc5fb48	speaking	IELTS Speaking : Talk about your travel experience	Practice speaking about your travel experience for IELTS Speaking	practice	intermediate	ielts	40	{"topicText": "Travel and Tourism", "promptText": "Let's practice speaking English", "followupExamples": ["What places have you visited?", "How was your last trip?", "Do you prefer traveling alone or with friends?", "What country would you like to visit next and why?"], "backgroundKnowledge": "Focus on travel experiences, cultural differences, and common travel vocabulary such as 'hotel', 'sightseeing', 'itinerary', 'passport'."}	https://img.freepik.com/hinh-chup-mien-phi/travel-concept-with-baggage_23-2149153260.jpg?ga=GA1.1.1179737765.1747448580&semt=ais_hybrid&w=740	{}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-05-22 14:45:57.203	2025-05-22 14:45:57.203	\N
2a839268-4d95-4bfc-a3f6-14cac5fb314d	writing	Writing Task 2 : Does workaholism have positive effects?	Nowadays, more people move away from their friends and families for work. Do advantages outweigh the disadvantages?	practice	intermediate	ielts	30	{"task": "Nowadays, more people move away from their friends and families for work. Do advantages outweigh the disadvantages?", "ai_prompt": "You are an expert IELTS writing teacher. You help students to improve their IELTS improve Idea and response Example like Introduction,Body1,Body2,Conclusion.", "resources": {"sample_essay": {"body1": "<p><strong>Admittedly, there may be some consequences when people leave their homes for a new place in search of better job opportunities. </strong><span style=\\"color: rgb(45, 194, 107);\\">One of them is that migrating across the country may emotionally impact migrants and their loved ones. Since life is often centered around established social circles, including families and friends, moving to a new location can result in homesickness and a sense of missing out on important events, potentially causing family members to drift apart over time. This is especially true in Asia, where people often value quality time with their family over socializing with friends. </span><span style=\\"color: rgb(53, 152, 219);\\">On a societal level, moving away for work could potentially cause instability in the labor market in less developed regions. This is because it could be difficult for rural enterprises to find suitable candidates for their job vacancies, eventually compromising their productivity as well as the competitiveness of the local economy.</span></p>", "body2": "\\n        <p><strong>However, despite these disadvantages, the benefits of relocating for work are more significant.</strong><span style=\\"color: rgb(45, 194, 107);\\"> In terms of career prospects, settling down in a new environment could help migrants to have the opportunity to pursue their dreams, which would only be possible by moving away from narrow minded people in the countryside. For example, in Asia, parents and the elderly often emphasize career stability over pursuing one’s passions, which leads to false expectations for their children’s futures, thus suppressing young people’s talents. </span><span style=\\"color: rgb(53, 152, 219);\\">Another benefit could be the opportunity to live in a foreign country, which, in addition to possible higher salaries, enables migrants to pursue jobs that may not be available in their home countries. A case in point is that IT workers stand to benefit greatly from working for major tech corporations in the US.</span></p>", "conclusion": "<p dir=\\"ltr\\">In conclusion, while I acknowledge that relocating for work may pose certain problems relating to migrants' feelings and the rural economy, I am convinced that the advantages in personal and professional growth are far more impactful.</p>", "instruction": "<p>It has become more common for people to relocate to a new city or country for work. <strong>Although this trend may present certain challenges, I believe the resultant benefits far outweigh them.</strong></p>"}, "analysis_guide": "<h2>HƯỚNG DẪN VIẾT BÀI</h2><p>&nbsp;</p><h3><em>Xem livestream giải đề này cùng thầy Phạm Minh Khoa (</em><strong><em>2 lần 9.0</em></strong><em>) <u>tại đây bạn nhé!</u></em></h3><p>&nbsp;</p><h2><strong><u>1. Giải thích đề</u></strong></h2><ul><li><p>Đề bài nói về xu hướng ngày càng nhiều người rời xa bạn bè và gia đình để đi làm việc ở nơi khác. Đề bài yêu cầu bạn cân nhắc xem liệu lợi ích của xu hướng này có lớn hơn những bất lợi hay không.</p></li></ul><ul><li><p>Đây là một chủ đề phổ biến trong thời đại toàn cầu hóa, khi người lao động có xu hướng di chuyển (<strong>relocate</strong>) đến các thành phố lớn hoặc nước ngoài để tìm kiếm cơ hội việc làm tốt hơn. Xu hướng này đặc biệt phổ biến ở các nước đang phát triển, nơi mà sự chênh lệch về cơ hội giữa các vùng miền còn lớn.</p></li></ul><p>&nbsp;</p><h2><strong><u>2. Gợi ý lập luận &amp; phân body</u></strong></h2><ul><li><p>Bạn có thể cho rằng lợi ích lớn hơn hoặc nhỏ hơn so với bất lợi.</p></li><li><p><strong>Trong bài này, chúng mình sẽ lập luận theo cách 40/60 (balanced approach)</strong></p></li><li><p>Chúng mình cho rằng lợi ích lớn hơn nhiều so với bất lợi (<strong>benefits far outweigh them</strong>). Chúng ta sẽ theo hướng này.</p><ul><li><p>Body 1 sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p></li><li><p>Body 2 sẽ thảo luận về những lợi ích đáng kể hơn của việc này.</p></li></ul></li></ul><p>&nbsp;</p><h2><strong><u>3. Gợi ý viết body 1</u></strong></h2><p>Mình sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa (<strong>relocating</strong>) để tìm việc có thể gây ra một số hậu quả (<strong>consequences</strong>) cho người di cư và xã hội.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Di cư (<strong>migrating</strong>) có thể gây tác động về mặt cảm xúc (<strong>emotionally impact</strong>) đối với người di cư và người thân</p><p>&nbsp; ➜ cuộc sống thường xoay quanh các mối quan hệ xã hội đã thiết lập (<strong>established social circles</strong>)&nbsp;</p><p>&nbsp; ➜ chuyển đến nơi mới có thể gây nhớ nhà (<strong>homesickness</strong>) và cảm giác bỏ lỡ các sự kiện quan trọng (<strong>missing out on important events</strong>)</p><p>&nbsp; ➜ có thể làm cho các thành viên gia đình xa cách nhau theo thời gian (<strong>drift apart over time</strong>)</p><p>&nbsp; ➜ đặc biệt đúng ở châu Á, nơi mọi người thường coi trọng thời gian chất lượng với gia đình hơn là giao tiếp xã hội với bạn bè</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Ở cấp độ xã hội (<strong>societal level</strong>), di chuyển đi làm xa có thể gây bất ổn cho thị trường lao động (<strong>instability in the labor market</strong>) ở các vùng kém phát triển hơn</p><p>&nbsp; ➜ doanh nghiệp nông thôn (<strong>rural enterprises</strong>) khó tìm được ứng viên phù hợp cho vị trí tuyển dụng</p><p>&nbsp; ➜ ảnh hưởng đến năng suất (<strong>compromising their productivity</strong>) và khả năng cạnh tranh của nền kinh tế địa phương (<strong>competitiveness of the local economy</strong>)</p><p>&nbsp;</p><h2><strong><u>4. Gợi ý viết body 2</u></strong></h2><p>Mình sẽ bàn về những lợi ích đáng kể của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa để làm việc mang lại những lợi ích đáng kể hơn (<strong>more significant</strong>) bất lợi của nó.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Về triển vọng nghề nghiệp (<strong>career prospects</strong>), định cư ở một môi trường mới (<strong>settling down in a new environment</strong>) giúp người di cư có cơ hội theo đuổi ước mơ (<strong>pursue their dreams</strong>)</p><p>&nbsp; ➜ tránh xa những người có tư tưởng hẹp hòi ở nông thôn (<strong>narrow minded people in the countryside</strong>)</p><p>&nbsp; ➜ ví dụ ở châu Á, cha mẹ và người lớn tuổi thường đề cao sự ổn định nghề nghiệp hơn là theo đuổi đam mê (<strong>pursuing one's passions</strong>)</p><p>&nbsp; ➜ tạo ra kỳ vọng sai lầm về tương lai của con cái (<strong>false expectations for their children's futures</strong>)&nbsp;</p><p>&nbsp; ➜ kìm hãm tài năng của giới trẻ (<strong>suppressing young people's talents</strong>)</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Cơ hội sống ở nước ngoài (<strong>live in a foreign country</strong>)</p><p>&nbsp; ➜ ngoài mức lương có thể cao hơn (<strong>higher salaries</strong>), còn cho phép người di cư theo đuổi những công việc không có sẵn ở quê nhà</p><p>&nbsp; ➜ ví dụ như công nhân IT được hưởng lợi rất nhiều khi làm việc cho các tập đoàn công nghệ lớn ở Mỹ (<strong>major tech corporations in the US</strong>)</p>"}, "vocabulary_list": [{"tags": [], "term": "Narrow-minded", "meaning": ["Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."], "image_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TELc3NIPCWOkt3n9g8joHY7ER2sAap4XdJqiIh", "next_review": "2025-05-23T05:27:38.925Z", "example_sentence": "The narrow-minded people in the countryside are not open to new ideas.", "repetition_level": 0}]}		{ielts,writing,task2}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-05-23 05:31:14.812	2025-05-23 05:31:26.267	2025-05-23 05:08:17.645
ec721b8c-4cbe-439d-b789-5c65e19f5e7f	writing	School uniforms should be mandatory in all schools	Some people believe that school uniforms should be mandatory in all schools.To what extent do you agree or disagree?	practice	beginner	ielts	30	{"task": "Some people believe that school uniforms should be mandatory in all schools.To what extent do you agree or disagree?", "ai_prompt": "You are an expert IELTS writing teacher. You help students to improve their IELTS improve Idea and response Example like Introduction,Body1,Body2,Conclusion.", "resources": {"sample_essay": {"body1": "<p>One major advantage of school uniforms is that they reduce visible economic differences among students. When everyone wears the same clothes, it minimizes bullying or judgment based on fashion or brand. Furthermore, uniforms encourage discipline and a sense of belonging among students, as they feel part of a community.</p>", "body2": "<p>However, some argue that wearing uniforms restricts students’ ability to express themselves. Clothing can be a form of identity and creativity, and forcing all students to wear the same thing may hinder personal development. Moreover, it does not address deeper issues in the education system, such as the quality of teaching or school facilities.</p>", "conclusion": "<p>In conclusion, while school uniforms may help promote equality and discipline, they should not be mandatory. Schools should focus more on improving education quality and respecting individual freedom.</p>", "instruction": "<p>There is an ongoing debate about whether school uniforms should be mandatory in all schools. While some argue that uniforms promote equality and discipline, others believe they limit self-expression.</p>"}, "analysis_guide": "<h2><strong>HƯỚNG DẪN VIẾT BÀI</strong></h2><p>📺 Xem livestream giải đề cùng thầy Phạm Minh Khoa (2 lần 9.0) tại đây bạn nhé!</p><h3><strong>1. Giải thích đề</strong></h3><p>Đề bài yêu cầu bạn đưa ra quan điểm về việc <strong>có nên bắt buộc tất cả học sinh phải mặc đồng phục hay không</strong>. Đây là một dạng <strong>opinion essay</strong>, bạn sẽ chọn một trong hai hướng:</p><ul><li><p><strong>Đồng ý</strong> (completely agree)</p></li><li><p><strong>Phản đối</strong> (completely disagree)</p></li><li><p>Hoặc chọn <strong>cách tiếp cận cân bằng</strong> (balanced approach) – đồng ý một phần, nhưng nêu rõ điều kiện.</p></li></ul><hr><h3><strong>2. Gợi ý lập luận &amp; phân chia bố cục bài viết</strong></h3><p>Chúng ta sẽ theo hướng <strong>đồng ý hoàn toàn (completely agree)</strong> rằng <strong>đồng phục nên được bắt buộc ở mọi trường học</strong>.</p><p><strong>Body 1</strong> – Lợi ích cá nhân: Tác động tích cực đến học sinh.<br><strong>Body 2</strong> – Lợi ích xã hội: Tạo bình đẳng và tăng tính kỷ luật.</p><hr><h3><strong>3. Gợi ý viết Body 1 – Lợi ích với học sinh</strong></h3><p>✦ <strong>Topic sentence</strong>: Việc mặc đồng phục mang lại nhiều lợi ích rõ rệt đối với cá nhân học sinh.</p><p>✦ <strong>Supporting idea 1</strong>: Giảm áp lực về ngoại hình và thời trang.</p><ul><li><p>➜ Học sinh không cần lo lắng về việc mặc gì mỗi ngày.</p></li><li><p>➜ Giảm so sánh, ganh đua về thương hiệu quần áo.</p></li><li><p>➜ Tăng sự tự tin cho học sinh từ hoàn cảnh khó khăn.</p></li></ul><p>✦ <strong>Supporting idea 2</strong>: Tăng sự tập trung vào học tập thay vì hình thức.</p><ul><li><p>➜ Khi không phải lo nghĩ về thời trang, học sinh có thể tập trung vào việc học.</p></li><li><p>➜ Ví dụ: Một nghiên cứu ở Nhật cho thấy học sinh mặc đồng phục có điểm số trung bình cao hơn.</p></li></ul><hr><h3><strong>4. Gợi ý viết Body 2 – Lợi ích với xã hội</strong></h3><p>✦ <strong>Topic sentence</strong>: Về mặt xã hội, đồng phục tạo ra sự công bằng và nâng cao kỷ luật.</p><p>✦ <strong>Supporting idea 1</strong>: Tạo sự bình đẳng giữa học sinh ở mọi hoàn cảnh.</p><ul><li><p>➜ Đồng phục xóa nhòa khác biệt về điều kiện kinh tế.</p></li><li><p>➜ Giảm nguy cơ bắt nạt vì ngoại hình hoặc quần áo.</p></li></ul><p>✦ <strong>Supporting idea 2</strong>: Góp phần tạo môi trường học tập nghiêm túc và có kỷ luật.</p><ul><li><p>➜ Đồng phục mang tính biểu tượng và nhắc nhở học sinh về vai trò của họ trong nhà trường.</p></li><li><p>➜ Giúp giáo viên dễ nhận diện học sinh khi xảy ra sự cố.</p></li></ul>"}, "vocabulary_list": [{"tags": [], "term": "mandatory", "meaning": ["bắt buộc"], "next_review": "2025-05-23T05:27:38.925Z", "reference_link": "https://www.vocabulary.com/dictionary/mandatory", "reference_name": "Vocabulary.com", "example_sentence": "School uniforms should be mandatory in all schools.", "repetition_level": 0}, {"tags": [], "term": "discipline", "meaning": ["kỷ luật"], "image_url": "", "reference_link": "https://www.vocabulary.com/dictionary/discipline", "reference_name": "Vocabulary.com", "example_sentence": "Uniforms help students maintain discipline.", "repetition_level": 0}, {"tags": [], "term": "equality", "meaning": ["sự bình đẳng"], "image_url": "", "reference_link": "https://www.vocabulary.com/dictionary/equality", "reference_name": "Vocabulary.com", "example_sentence": "Uniforms promote a sense of equality.", "repetition_level": 0}, {"tags": [], "term": "community", "meaning": ["cộng đồng"], "image_url": "", "reference_link": "https://www.vocabulary.com/dictionary/community", "reference_name": "vocabulary.com", "example_sentence": "Uniforms give a feeling of belonging to a community.", "repetition_level": 0}]}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEhFD80B20jGCrUK3yIO18HXvFLsN7Wm5MwPha	{ielts,writing,task2}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-05-23 05:28:02.967	2025-06-13 07:54:34.314	\N
c74e98e2-e13f-4e3f-94b3-1479d1cfb657	reading	Policy in home	Practice reading an opinion essay for IELTS Reading Task 2	practice	intermediate	ielts	40	{"text": "To: All Staff\\nFrom: Human Resources Department\\nSubject: Updated Office Attendance Policy\\n\\nDear Employees,\\n\\nWe would like to inform you of an important update to our attendance policy. Starting next Monday, all employees are required to clock in using the new digital attendance system installed at the main entrance.\\n\\nThis system will automatically record your arrival and departure times. Please ensure that you arrive no later than 9:00 A.M. and do not leave before 5:00 P.M. without prior approval from your supervisor.\\n\\nAny employee who fails to follow this procedure three times within a month may be subject to a warning.\\n\\nIf you have any questions, please contact the HR department.", "questions": [{"id": "1", "question": "What is the main purpose of this email?", "answer_list": [{"answer": "To announce a new employee benefit"}, {"answer": "To introduce a new attendance system"}, {"answer": "To promote an employee training session"}, {"answer": "To notify about a holiday schedule"}], "is_bookmark": false, "right_answer": "To introduce a new attendance system"}, {"id": "2", "question": "When will the new system be implemented?", "answer_list": [{"answer": "Tomorrow"}, {"answer": "Next Monday"}, {"answer": "This Friday"}, {"answer": "Next month"}], "is_bookmark": false, "right_answer": "Next Monday"}, {"id": "3", "question": "What will happen if an employee fails to follow the policy three times in a month?", "answer_list": [{"answer": "They will be fined"}, {"answer": "They will lose a bonus"}, {"answer": "They may receive a warning"}, {"answer": "They must attend a training"}], "is_bookmark": false, "right_answer": "They may receive a warning"}, {"id": "4", "question": "Where is the attendance system located?", "answer_list": [{"answer": "In each department"}, {"answer": "At the front desk"}, {"answer": "Online via mobile app"}, {"answer": "At the main entrance"}], "is_bookmark": false, "right_answer": "At the main entrance"}], "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	https://img.freepik.com/hinh-chup-mien-phi/privacy-policy-information-principle-strategy-rules-concept_53876-147698.jpg	{}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-05-22 14:45:57.091	2025-06-15 18:38:53.036	\N
86e747e3-3f19-40cb-a93d-55ad77bf4122	writing	Does workaholism have positive effects?	Explore whether being a workaholic leads to success or burnout. In this writing task, you'll give your opinion and discuss the possible benefits and downsides of workaholism in modern life.	practice	intermediate	ielts	40	{"task": "<p>Explore whether being a workaholic leads to success or burnout. In this writing task, you'll give your opinion and discuss the possible benefits and downsides of workaholism in modern life.</p>", "ai_prompt": "You are an expert IELTS writing teacher. You help students to improve their IELTS improve Idea and response Example like Introduction,Body1,Body2,Conclusion.", "resources": {"sample_essay": {"body1": "<p>Admittedly, there may be some consequences when people leave their homes for a new place in search of better job opportunities. One of them is that migrating across the country may emotionally impact migrants and their loved ones. Since life is often centered around established social circles, including families and friends, moving to a new location can result in homesickness and a sense of missing out on important events, potentially causing family members to drift apart over time. This is especially true in Asia, where people often value quality time with their family over socializing with friends. On a societal level, moving away for work could potentially cause instability in the labor market in less developed regions. This is because it could be difficult for rural enterprises to find suitable candidates for their job vacancies, eventually compromising their productivity as well as the competitiveness of the local economy.</p>", "body2": "<p>However, despite these disadvantages, the benefits of relocating for work are more significant. In terms of career prospects, settling down in a new environment could help migrants to have the opportunity to pursue their dreams, which would only be possible by moving away from narrow minded people in the countryside. For example, in Asia, parents and the elderly often emphasize career stability over pursuing one’s passions, which leads to false expectations for their children’s futures, thus suppressing young people’s talents. Another benefit could be the opportunity to live in a foreign country, which, in addition to possible higher salaries, enables migrants to pursue jobs that may not be available in their home countries. A case in point is that IT workers stand to benefit greatly from working for major tech corporations in the US.</p>", "conclusion": "<p>In conclusion, while I acknowledge that relocating for work may pose certain problems relating to migrants' feelings and the rural economy, I am convinced that the advantages in personal and professional growth are far more impactful.</p>", "instruction": "<p>It has become more common for people to relocate to a new city or country for work. <strong>Although this trend may present certain challenges, I believe the resultant benefits far outweigh them.</strong></p>"}, "analysis_guide": "<h2>HƯỚNG DẪN VIẾT BÀI</h2><p>&nbsp;</p><h3><em>Xem livestream giải đề này cùng thầy Phạm Minh Khoa (</em><strong><em>2 lần 9.0</em></strong><em>) <u>tại đây bạn nhé!</u></em></h3><p>&nbsp;</p><h2><strong><u>1. Giải thích đề</u></strong></h2><ul><li><p>Đề bài nói về xu hướng ngày càng nhiều người rời xa bạn bè và gia đình để đi làm việc ở nơi khác. Đề bài yêu cầu bạn cân nhắc xem liệu lợi ích của xu hướng này có lớn hơn những bất lợi hay không.</p></li></ul><ul><li><p>Đây là một chủ đề phổ biến trong thời đại toàn cầu hóa, khi người lao động có xu hướng di chuyển (<strong>relocate</strong>) đến các thành phố lớn hoặc nước ngoài để tìm kiếm cơ hội việc làm tốt hơn. Xu hướng này đặc biệt phổ biến ở các nước đang phát triển, nơi mà sự chênh lệch về cơ hội giữa các vùng miền còn lớn.</p></li></ul><p>&nbsp;</p><h2><strong><u>2. Gợi ý lập luận &amp; phân body</u></strong></h2><ul><li><p>Bạn có thể cho rằng lợi ích lớn hơn hoặc nhỏ hơn so với bất lợi.</p></li><li><p><strong>Trong bài này, chúng mình sẽ lập luận theo cách 40/60 (balanced approach)</strong></p></li><li><p>Chúng mình cho rằng lợi ích lớn hơn nhiều so với bất lợi (<strong>benefits far outweigh them</strong>). Chúng ta sẽ theo hướng này.</p><ul><li><p>Body 1 sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p></li><li><p>Body 2 sẽ thảo luận về những lợi ích đáng kể hơn của việc này.</p></li></ul></li></ul><p>&nbsp;</p><h2><strong><u>3. Gợi ý viết body 1</u></strong></h2><p>Mình sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa (<strong>relocating</strong>) để tìm việc có thể gây ra một số hậu quả (<strong>consequences</strong>) cho người di cư và xã hội.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Di cư (<strong>migrating</strong>) có thể gây tác động về mặt cảm xúc (<strong>emotionally impact</strong>) đối với người di cư và người thân</p><p>&nbsp; ➜ cuộc sống thường xoay quanh các mối quan hệ xã hội đã thiết lập (<strong>established social circles</strong>)&nbsp;</p><p>&nbsp; ➜ chuyển đến nơi mới có thể gây nhớ nhà (<strong>homesickness</strong>) và cảm giác bỏ lỡ các sự kiện quan trọng (<strong>missing out on important events</strong>)</p><p>&nbsp; ➜ có thể làm cho các thành viên gia đình xa cách nhau theo thời gian (<strong>drift apart over time</strong>)</p><p>&nbsp; ➜ đặc biệt đúng ở châu Á, nơi mọi người thường coi trọng thời gian chất lượng với gia đình hơn là giao tiếp xã hội với bạn bè</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Ở cấp độ xã hội (<strong>societal level</strong>), di chuyển đi làm xa có thể gây bất ổn cho thị trường lao động (<strong>instability in the labor market</strong>) ở các vùng kém phát triển hơn</p><p>&nbsp; ➜ doanh nghiệp nông thôn (<strong>rural enterprises</strong>) khó tìm được ứng viên phù hợp cho vị trí tuyển dụng</p><p>&nbsp; ➜ ảnh hưởng đến năng suất (<strong>compromising their productivity</strong>) và khả năng cạnh tranh của nền kinh tế địa phương (<strong>competitiveness of the local economy</strong>)</p><p>&nbsp;</p><h2><strong><u>4. Gợi ý viết body 2</u></strong></h2><p>Mình sẽ bàn về những lợi ích đáng kể của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa để làm việc mang lại những lợi ích đáng kể hơn (<strong>more significant</strong>) bất lợi của nó.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Về triển vọng nghề nghiệp (<strong>career prospects</strong>), định cư ở một môi trường mới (<strong>settling down in a new environment</strong>) giúp người di cư có cơ hội theo đuổi ước mơ (<strong>pursue their dreams</strong>)</p><p>&nbsp; ➜ tránh xa những người có tư tưởng hẹp hòi ở nông thôn (<strong>narrow minded people in the countryside</strong>)</p><p>&nbsp; ➜ ví dụ ở châu Á, cha mẹ và người lớn tuổi thường đề cao sự ổn định nghề nghiệp hơn là theo đuổi đam mê (<strong>pursuing one's passions</strong>)</p><p>&nbsp; ➜ tạo ra kỳ vọng sai lầm về tương lai của con cái (<strong>false expectations for their children's futures</strong>)&nbsp;</p><p>&nbsp; ➜ kìm hãm tài năng của giới trẻ (<strong>suppressing young people's talents</strong>)</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Cơ hội sống ở nước ngoài (<strong>live in a foreign country</strong>)</p><p>&nbsp; ➜ ngoài mức lương có thể cao hơn (<strong>higher salaries</strong>), còn cho phép người di cư theo đuổi những công việc không có sẵn ở quê nhà</p><p>&nbsp; ➜ ví dụ như công nhân IT được hưởng lợi rất nhiều khi làm việc cho các tập đoàn công nghệ lớn ở Mỹ (<strong>major tech corporations in the US</strong>)</p>"}, "vocabulary_list": [{"tags": [], "term": "Narrow-minded", "meaning": ["Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."], "image_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE6XWLceVa9HvtmCzUZoWN10p2qhedE87yuTDx", "next_review": "2025-05-17T02:11:12.345Z", "reference_link": "https://www.vocabulary.com/dictionary/narrow-minded", "reference_name": "Vocabulary.com", "example_sentence": "The narrow-minded people in the countryside are not open to new ideas.", "repetition_level": 0}, {"tags": [], "term": "workaholism", "meaning": ["compulsiveness about working"], "image_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE8Y3fjmvjWAixkLwGz4PUNlCrB32nvS9DFIpc", "reference_link": "https://www.vocabulary.com/dictionary/workaholism", "reference_name": "Vocabulary.com", "example_sentence": "His personal life has certainly paid the price for his workaholism.", "repetition_level": 0}, {"tags": [], "term": "competitiveness", "meaning": ["an aggressive willingness to compete"], "image_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEtPsOJQU751Yhfg6e2LqHyVuO3bUi4rzBEc09", "reference_link": "https://www.vocabulary.com/dictionary/competitiveness", "reference_name": "Vocabulary.com", "example_sentence": "eventually compromising their productivity as well as the competitiveness of the local economy.", "repetition_level": 0}]}	https://img.freepik.com/vector-mien-phi/procrastination-concept-illustration_114360-17291.jpg	{}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-05-22 14:45:56.997	2025-06-17 13:18:56.136	\N
084ce279-3f80-4a37-96f7-d89b2555c52a	writing	Writing Task 2 : Technology has made people less social.	This topic discusses whether modern technology, especially smartphones and social media, has reduced face-to-face interactions and made people less sociable.	practice	advanced	ielts	30	{"task": "<p>This topic discusses whether modern technology, especially smartphones and social media, has reduced face-to-face interactions and made people less sociable.</p>", "ai_prompt": "You are an expert IELTS writing teacher. You help students to improve their IELTS improve Idea and response Example like Introduction,Body1,Body2,Conclusion.", "resources": {"sample_essay": {"body1": "<p>It is true that people today spend more time looking at screens than engaging in face-to-face conversations. Social media often replaces real interactions, and some individuals may prefer chatting online over meeting friends in person. As a result, traditional forms of communication, such as phone calls or visits, are becoming less common.</p>", "body2": "<p>On the other hand, technology enables us to stay connected with people across the world. Video calls, messaging apps, and online communities allow even shy individuals or those living far from loved ones to interact and build relationships. In this sense, technology has expanded our social opportunities rather than reduced them.</p>", "conclusion": "<p>In conclusion, while technology may reduce in-person interactions, it also provides new ways for people to socialize. Therefore, it cannot be said that technology has made people less social overall.</p>", "instruction": "<p>Many people claim that technology, especially smartphones and social media, has made individuals less social in real life. However, others argue that technology simply changes the way we connect, not the quantity or quality of our relationships.</p>"}, "analysis_guide": "<h2>HƯỚNG DẪN VIẾT BÀI</h2><p>&nbsp;</p><h3><strong>Giải thích đề:</strong><br>Đề bài hỏi công nghệ có khiến con người trở nên ít giao tiếp xã hội hơn không. Bạn có thể đồng ý, phản đối, hoặc đưa ra quan điểm cân bằng.</h3><ul><li><p><strong>Gợi ý lập luận &amp; phân body:</strong></p><ul><li><p><strong>Body 1:</strong> Công nghệ làm giảm tương tác trực tiếp</p></li><li><p><strong>Body 2:</strong> Công nghệ giúp mở rộng mạng lưới xã hội theo cách khác</p></li></ul></li><li><p><strong>Gợi ý viết Body 1:</strong></p><ul><li><p>Người ta dành nhiều thời gian cho điện thoại hơn là trò chuyện trực tiếp</p></li><li><p>Ít hoạt động ngoài trời hoặc họp mặt truyền thống</p></li></ul></li><li><p><strong>Gợi ý viết Body 2:</strong></p><ul><li><p>Công nghệ giúp kết nối từ xa</p></li><li><p>Tạo điều kiện cho người hướng nội, người sống xa gia đình</p></li></ul></li></ul>"}, "vocabulary_list": [{"tags": [], "term": "social interaction", "meaning": ["tương tác xã hội"], "next_review": "2025-06-13T04:01:49.008Z", "example_sentence": "Technology has changed the way we experience social interaction.", "repetition_level": 0}, {"tags": [], "term": "face-to-face", "meaning": ["mặt đối mặt"], "image_url": "", "reference_link": "", "reference_name": "", "example_sentence": "People prefer face-to-face communication.", "repetition_level": 0}, {"tags": [], "term": "isolated", "meaning": ["bị cô lập"], "image_url": "", "reference_link": "", "reference_name": "", "example_sentence": "Too much screen time can make people feel isolated.", "repetition_level": 0}, {"tags": [], "term": "connect\\t", "meaning": ["kết nối"], "image_url": "", "reference_link": "", "reference_name": "", "example_sentence": "Social media helps us connect with others globally.", "repetition_level": 0}]}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEgMZGh7c1j3fWQPY5NnMFbZouTXBVHdq9vitI	{ielts,writing,task2}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-13 04:43:34.352	2025-06-13 04:50:15.717	\N
3c51bbc1-a1ee-4fa8-acc9-8bb331f70835	speaking	Daily Routine	This topic focuses on everyday activities such as waking up, going to school or work, having meals, and relaxing. It helps students become comfortable with using the present simple tense and basic daily vocabulary.	practice	beginner	ielts	30	{"topicText": "Daily Routine", "promptText": "This topic focuses on everyday activities such as waking up, going to school or work, having meals, and relaxing. It helps students become comfortable with using the present simple tense and basic daily vocabulary.", "followupExamples": ["What time do you usually wake up and go to bed?", "What is your favorite part of the day? Why?", "Do you prefer a fixed routine or a flexible one?", "What would you like to change in your daily routine?"], "backgroundKnowledge": "Keywords: wake up, go to bed, have breakfast/lunch/dinner, go to work/school, commute, relax, chores\\nFocus on present simple tense and time expressions (e.g., usually, always, sometimes, in the morning)"}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEjE3XcYOYDINht87bRguQC0ZJd2wilPLzk5K9	{ielts,speaking,travel,tourism}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-13 05:00:38.837	2025-06-13 05:39:24.15	\N
75df0d67-c3f2-4633-b24e-18fc3cb0e775	writing	Writing Task 2 : Governments should invest more in public transportation than in building new roads.	This topic focuses on whether governments should prioritize funding for public transport systems over expanding road infrastructure. It involves environmental, economic, and social considerations.	test	advanced	ielts	30	{"task": "<p>This topic focuses on whether governments should prioritize funding for public transport systems over expanding road infrastructure. It involves environmental, economic, and social considerations.</p>", "ai_prompt": "You are an expert IELTS writing teacher. You help students to improve their IELTS improve Idea and response Example like Introduction,Body1,Body2,Conclusion.", "resources": {"sample_essay": {"body1": "<p>Investing in public transportation offers several benefits. First, it can significantly reduce traffic congestion by encouraging people to use buses, trains, or subways instead of private cars. This not only saves time but also lowers air pollution and greenhouse gas emissions. Additionally, public transport is more cost-effective for citizens, especially those who cannot afford a personal vehicle.</p>", "body2": "<p>Conversely, building more roads may lead to negative consequences. It often results in deforestation and habitat destruction, especially in urban expansion projects. Furthermore, more roads usually mean more cars, which in turn leads to increased emissions and noise pollution. In the long term, this strategy is unsustainable and may worsen urban living conditions.</p>", "conclusion": "<p>In conclusion, governments should prioritize investment in public transportation systems as they offer long-term environmental and economic benefits. Expanding road networks may provide short-term relief but is not a sustainable solution.</p>", "instruction": "<p>As urban populations grow, transportation infrastructure becomes increasingly important. Some argue that governments should invest more in public transportation rather than building new roads. I strongly agree with this view for environmental, economic, and social reasons.</p>"}, "analysis_guide": "<h2>HƯỚNG DẪN VIẾT BÀI</h2><p>&nbsp;</p><h3><strong>Giải thích đề:</strong><br>Đề yêu cầu chọn lập trường: nên đầu tư vào giao thông công cộng hay xây thêm đường. Đề này yêu cầu phân tích cả lợi ích, tác động môi trường, chi phí.</h3><ul><li><p><strong>Gợi ý lập luận &amp; phân body:</strong></p><ul><li><p><strong>Body 1:</strong> Lợi ích của giao thông công cộng</p></li><li><p><strong>Body 2:</strong> Hạn chế của việc xây thêm đường</p></li></ul></li><li><p><strong>Gợi ý viết Body 1:</strong></p><ul><li><p>Giảm ùn tắc</p></li><li><p>Ít ô nhiễm hơn</p></li><li><p>Hiệu quả kinh tế dài hạn</p></li></ul></li><li><p><strong>Gợi ý viết Body 2:</strong></p><ul><li><p>Xây đường tốn kém, không bền vững</p></li><li><p>Gây thêm ô nhiễm, ảnh hưởng đến môi trường sống</p></li></ul></li></ul>"}, "vocabulary_list": [{"tags": [], "term": "infrastructure\\t", "meaning": ["cơ sở hạ tầng"], "next_review": "2025-06-13T04:01:49.008Z", "example_sentence": "Public transportation infrastructure needs more funding.", "repetition_level": 0}, {"tags": [], "term": "congestion", "meaning": ["tắc nghẽn"], "image_url": "", "reference_link": "", "reference_name": "", "example_sentence": "\\tPublic transport reduces traffic congestion.", "repetition_level": 0}, {"tags": [], "term": "cost-effective", "meaning": ["hiệu quả chi phí"], "image_url": "", "reference_link": "", "reference_name": "", "example_sentence": "Buses are a cost-effective alternative to cars.", "repetition_level": 0}, {"tags": [], "term": "emissions", "meaning": ["emissions"], "image_url": "", "reference_link": "", "reference_name": "", "example_sentence": "Public transport helps lower carbon emissions.", "repetition_level": 0}, {"tags": [], "term": "sustainable", "meaning": ["bền vững"], "image_url": "", "reference_link": "", "reference_name": "", "example_sentence": "This solution is more sustainable in the long run.", "repetition_level": 0}]}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEnycXfszXUtQ8zNR7ZOGJrkqmh9b4YgKwsl5S	{ielts,writing,task2}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-13 04:47:52.725	2025-06-15 09:36:52.024	\N
083b2bf6-6532-4657-b7d3-290799122ee5	speaking	Environmental Issues and Solutions 	This advanced topic helps learners articulate complex ideas about environmental challenges, causes, and sustainable solutions. It encourages the use of formal language, passive voice, and argumentative structures.	practice	beginner	ielts	30	{"topicText": "Environmental Issues and Solutions ", "promptText": "Let's practice speaking English", "followupExamples": ["What are the most serious environmental issues in your country?", "What role do individuals play in protecting the environment?", "How can governments encourage people to live more sustainably?", "Do you believe that economic growth and environmental protection can go hand in hand?"], "backgroundKnowledge": "Keywords: climate change, pollution, deforestation, carbon footprint, renewable energy, sustainability\\nFocus on cause-effect structures (due to, as a result of), modal verbs for suggestion (should, must), and passive voice (e.g., is caused by)\\n\\n"}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEuTrITB4y26r1WjiDd0gomR9LCyeVqXFNQszc	{ielts,speaking,travel,tourism}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-05-23 05:28:36.572	2025-06-15 09:46:41.454	\N
a1208214-e707-4990-9d7b-c9f96c837fa7	listening	Technology and Daily Life	This topic helps learners talk about how technology affects their daily routines, work, or studies. It includes vocabulary related to apps, social media, and digital habits.	practice	intermediate	ielts	30	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEH7CTilIEC6Sj4VMqfK853BkIXrcvbwF9DUTm", "questions": [{"id": "1", "question": "What does the speaker do in the morning with their phone?", "answer_list": [{"answer": "Play games"}, {"answer": "Watch movies"}, {"answer": "Check weather and calendar "}, {"answer": "Call friends"}], "is_bookmark": false, "right_answer": "Check weather and calendar"}, {"id": "2", "question": "What is the speaker's opinion about technology?\\n", "answer_list": [{"answer": "It is useless"}, {"answer": "It makes life more complicated"}, {"answer": "It has no effect on their life"}, {"answer": "It makes life easier but increases screen time"}], "is_bookmark": false, "right_answer": "It makes life easier but increases screen time"}, {"id": "3", "question": "What does the speaker do in the evening?", "answer_list": [{"answer": "Go jogging"}, {"answer": "Watch videos or read news"}, {"answer": "Cook dinner"}, {"answer": "Do homework"}], "is_bookmark": false, "right_answer": "Watch videos or read news"}], "youtube_embed_url": "https://www.youtube.com/embed/58i-0Kul26I"}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TERDrvPNYWPY16CnpTL4HlG8fudoAmM3cqswIE	{ielts,listening,café,food,healthy-eating}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-13 05:20:41.519	2025-06-15 18:37:43.23	\N
0c2eba37-b8ec-498f-b15a-4c7fe64bcc63	listening	Travel and Holidays	This topic focuses on traveling and going on holidays. Learners will practice vocabulary related to transportation, accommodation, and activities during vacations.	practice	beginner	ielts	30	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEzmHO3e65IXY87RvtSFnoKrfUjeyzaDcTJhWB", "questions": [{"id": "1", "question": "Where did the speaker go last summer?", "answer_list": [{"answer": "Ho Chi Minh City"}, {"answer": "Hanoi"}, {"answer": "Da Nang"}, {"answer": "Nha Trang"}], "is_bookmark": false, "right_answer": "Da Nang"}, {"id": "2", "question": "What did they do every morning?", "answer_list": [{"answer": "They went shopping"}, {"answer": "They swam in the pool"}, {"answer": "They walked along the beach"}, {"answer": "They went to school"}], "is_bookmark": false, "right_answer": "They walked along the beach"}, {"id": "3", "question": "What was the weather like?", "answer_list": [{"answer": "It was rainy"}, {"answer": "It was foggy"}, {"answer": "It was cold"}, {"answer": "It was sunny"}], "is_bookmark": false, "right_answer": "It was sunny"}], "youtube_embed_url": "https://www.youtube.com/embed/58i-0Kul26I"}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEFKWDCEWNOBZVRtYmaGTokEgPSMuA5U2jxqwi	{ielts,listening,café,food,healthy-eating}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-05-23 05:35:18.073	2025-06-15 18:37:55.115	\N
b787c248-dce5-416f-b3b4-7259dcf7281c	reading	Renewable Energy Sources	Read a short article about different types of renewable energy and how they help protect the environment	test	advanced	ielts	30	{"text": "<p>Renewable energy comes from natural sources that are constantly replaced by the Earth. Unlike fossil fuels such as coal, oil, and natural gas, renewable energy does not run out and causes less harm to the environment. The most common renewable sources include sunlight, wind, water, and organic materials. As global energy demand increases, more countries are turning to renewable energy to reduce pollution and slow down climate change.</p><p>There are several popular types of renewable energy. Solar energy uses sunlight, which is captured by solar panels and turned into electricity. Wind energy is produced by wind turbines that spin when the wind blows. Hydropower uses the movement of rivers or dams to generate electricity. Biomass energy is made from plant and animal waste, which can be burned or turned into fuel. Geothermal energy, which comes from heat deep underground, is also used in some places. Each energy type has its strengths and is used based on the local environment and resources.</p><p>Although renewable energy is better for the planet, it still faces challenges. Solar and wind energy depend on the weather, which is not always predictable. Setting up solar panels, wind turbines, or hydropower systems can also cost a lot at first. However, the long-term savings and environmental benefits make these sources a smart choice. As technology improves and more governments support green energy, renewable power is becoming more reliable and affordable around the world.</p>", "questions": [{"id": "1", "question": "Why are renewable energy sources better than fossil fuels?", "answer_list": [{"answer": "They are cheaper to install"}, {"answer": "They are more popular"}, {"answer": "They do not release harmful gases"}, {"answer": "They work only at night"}], "is_bookmark": false, "right_answer": "They do not release harmful gases"}, {"id": "2", "question": "What is one problem with renewable energy?", "answer_list": [{"answer": "It pollutes rivers"}, {"answer": "It causes earthquakes"}, {"answer": "It needs better storage technology"}, {"answer": "t increases global warming"}], "is_bookmark": false, "right_answer": "It needs better storage technology"}, {"id": "3", "question": "What will happen if an employee fails to follow the policy three times in a month?", "answer_list": [{"answer": "Ignoring it"}, {"answer": "Banning it"}, {"answer": " Investing in it"}, {"answer": "Replacing it with fossil fuels"}], "is_bookmark": false, "right_answer": "Investing in it"}], "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE2zG0BUeZXkmTv29yOGxFKj6AEzZqgnMdBfl5	{ielts,reading,office,policy}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-13 05:38:30.401	2025-06-15 18:38:24.476	\N
6a30a66b-3c48-449f-83cd-55cb0bb0ed95	speaking	Technology and Daily Life	This topic allows learners to talk about how they use technology (phones, computers, the internet) in their daily lives, and how it affects communication, learning, and work. Students will practice giving opinions and making comparisons.	test	advanced	ielts	30	{"topicText": "Technology and Daily Life", "promptText": "Let's practice speaking English", "followupExamples": ["How do you use technology in your everyday life?", "Do you think people are too dependent on technology today?", "How has technology changed communication?", "Would you prefer a day without technology? Why or why not?"], "backgroundKnowledge": "Keywords: smartphone, app, internet, screen time, convenience, distraction, social media\\nFocus on giving opinions, using comparatives (e.g., easier than before), and contrast (however, although)"}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEFK4zjbbNOBZVRtYmaGTokEgPSMuA5U2jxqwi	{ielts,speaking,travel,tourism}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-13 05:04:20.819	2025-06-13 05:39:18.997	\N
5f378207-1134-4950-8582-474c9deec925	writing	Writing Task 2 : Does workaholism have posi	Nowadays, more people move away from their friends and families for work. Do advantages outweigh the disadvantages?	practice	intermediate	ielts	30	{"task": "Nowadays, more people move away from their friends and families for work. Do advantages outweigh the disadvantages?", "ai_prompt": "You are an expert IELTS writing teacher. You help students to improve their IELTS improve Idea and response Example like Introduction,Body1,Body2,Conclusion.", "resources": {"sample_essay": {"body1": "<p><strong>Admittedly, there may be some consequences when people leave their homes for a new place in search of better job opportunities. </strong><span style=\\"color: rgb(45, 194, 107);\\">One of them is that migrating across the country may emotionally impact migrants and their loved ones. Since life is often centered around established social circles, including families and friends, moving to a new location can result in homesickness and a sense of missing out on important events, potentially causing family members to drift apart over time. This is especially true in Asia, where people often value quality time with their family over socializing with friends. </span><span style=\\"color: rgb(53, 152, 219);\\">On a societal level, moving away for work could potentially cause instability in the labor market in less developed regions. This is because it could be difficult for rural enterprises to find suitable candidates for their job vacancies, eventually compromising their productivity as well as the competitiveness of the local economy.</span></p>", "body2": "\\n        <p><strong>However, despite these disadvantages, the benefits of relocating for work are more significant.</strong><span style=\\"color: rgb(45, 194, 107);\\"> In terms of career prospects, settling down in a new environment could help migrants to have the opportunity to pursue their dreams, which would only be possible by moving away from narrow minded people in the countryside. For example, in Asia, parents and the elderly often emphasize career stability over pursuing one’s passions, which leads to false expectations for their children’s futures, thus suppressing young people’s talents. </span><span style=\\"color: rgb(53, 152, 219);\\">Another benefit could be the opportunity to live in a foreign country, which, in addition to possible higher salaries, enables migrants to pursue jobs that may not be available in their home countries. A case in point is that IT workers stand to benefit greatly from working for major tech corporations in the US.</span></p>", "conclusion": "<p dir=\\"ltr\\">In conclusion, while I acknowledge that relocating for work may pose certain problems relating to migrants' feelings and the rural economy, I am convinced that the advantages in personal and professional growth are far more impactful.</p>", "instruction": "<p>It has become more common for people to relocate to a new city or country for work. <strong>Although this trend may present certain challenges, I believe the resultant benefits far outweigh them.</strong></p>"}, "analysis_guide": "<h2>HƯỚNG DẪN VIẾT BÀI</h2><p>&nbsp;</p><h3><em>Xem livestream giải đề này cùng thầy Phạm Minh Khoa (</em><strong><em>2 lần 9.0</em></strong><em>) <u>tại đây bạn nhé!</u></em></h3><p>&nbsp;</p><h2><strong><u>1. Giải thích đề</u></strong></h2><ul><li><p>Đề bài nói về xu hướng ngày càng nhiều người rời xa bạn bè và gia đình để đi làm việc ở nơi khác. Đề bài yêu cầu bạn cân nhắc xem liệu lợi ích của xu hướng này có lớn hơn những bất lợi hay không.</p></li></ul><ul><li><p>Đây là một chủ đề phổ biến trong thời đại toàn cầu hóa, khi người lao động có xu hướng di chuyển (<strong>relocate</strong>) đến các thành phố lớn hoặc nước ngoài để tìm kiếm cơ hội việc làm tốt hơn. Xu hướng này đặc biệt phổ biến ở các nước đang phát triển, nơi mà sự chênh lệch về cơ hội giữa các vùng miền còn lớn.</p></li></ul><p>&nbsp;</p><h2><strong><u>2. Gợi ý lập luận &amp; phân body</u></strong></h2><ul><li><p>Bạn có thể cho rằng lợi ích lớn hơn hoặc nhỏ hơn so với bất lợi.</p></li><li><p><strong>Trong bài này, chúng mình sẽ lập luận theo cách 40/60 (balanced approach)</strong></p></li><li><p>Chúng mình cho rằng lợi ích lớn hơn nhiều so với bất lợi (<strong>benefits far outweigh them</strong>). Chúng ta sẽ theo hướng này.</p><ul><li><p>Body 1 sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p></li><li><p>Body 2 sẽ thảo luận về những lợi ích đáng kể hơn của việc này.</p></li></ul></li></ul><p>&nbsp;</p><h2><strong><u>3. Gợi ý viết body 1</u></strong></h2><p>Mình sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa (<strong>relocating</strong>) để tìm việc có thể gây ra một số hậu quả (<strong>consequences</strong>) cho người di cư và xã hội.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Di cư (<strong>migrating</strong>) có thể gây tác động về mặt cảm xúc (<strong>emotionally impact</strong>) đối với người di cư và người thân</p><p>&nbsp; ➜ cuộc sống thường xoay quanh các mối quan hệ xã hội đã thiết lập (<strong>established social circles</strong>)&nbsp;</p><p>&nbsp; ➜ chuyển đến nơi mới có thể gây nhớ nhà (<strong>homesickness</strong>) và cảm giác bỏ lỡ các sự kiện quan trọng (<strong>missing out on important events</strong>)</p><p>&nbsp; ➜ có thể làm cho các thành viên gia đình xa cách nhau theo thời gian (<strong>drift apart over time</strong>)</p><p>&nbsp; ➜ đặc biệt đúng ở châu Á, nơi mọi người thường coi trọng thời gian chất lượng với gia đình hơn là giao tiếp xã hội với bạn bè</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Ở cấp độ xã hội (<strong>societal level</strong>), di chuyển đi làm xa có thể gây bất ổn cho thị trường lao động (<strong>instability in the labor market</strong>) ở các vùng kém phát triển hơn</p><p>&nbsp; ➜ doanh nghiệp nông thôn (<strong>rural enterprises</strong>) khó tìm được ứng viên phù hợp cho vị trí tuyển dụng</p><p>&nbsp; ➜ ảnh hưởng đến năng suất (<strong>compromising their productivity</strong>) và khả năng cạnh tranh của nền kinh tế địa phương (<strong>competitiveness of the local economy</strong>)</p><p>&nbsp;</p><h2><strong><u>4. Gợi ý viết body 2</u></strong></h2><p>Mình sẽ bàn về những lợi ích đáng kể của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa để làm việc mang lại những lợi ích đáng kể hơn (<strong>more significant</strong>) bất lợi của nó.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Về triển vọng nghề nghiệp (<strong>career prospects</strong>), định cư ở một môi trường mới (<strong>settling down in a new environment</strong>) giúp người di cư có cơ hội theo đuổi ước mơ (<strong>pursue their dreams</strong>)</p><p>&nbsp; ➜ tránh xa những người có tư tưởng hẹp hòi ở nông thôn (<strong>narrow minded people in the countryside</strong>)</p><p>&nbsp; ➜ ví dụ ở châu Á, cha mẹ và người lớn tuổi thường đề cao sự ổn định nghề nghiệp hơn là theo đuổi đam mê (<strong>pursuing one's passions</strong>)</p><p>&nbsp; ➜ tạo ra kỳ vọng sai lầm về tương lai của con cái (<strong>false expectations for their children's futures</strong>)&nbsp;</p><p>&nbsp; ➜ kìm hãm tài năng của giới trẻ (<strong>suppressing young people's talents</strong>)</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Cơ hội sống ở nước ngoài (<strong>live in a foreign country</strong>)</p><p>&nbsp; ➜ ngoài mức lương có thể cao hơn (<strong>higher salaries</strong>), còn cho phép người di cư theo đuổi những công việc không có sẵn ở quê nhà</p><p>&nbsp; ➜ ví dụ như công nhân IT được hưởng lợi rất nhiều khi làm việc cho các tập đoàn công nghệ lớn ở Mỹ (<strong>major tech corporations in the US</strong>)</p>"}, "vocabulary_list": [{"tags": [], "term": "Narrow-minded", "meaning": ["Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."], "next_review": "2025-06-15T09:34:39.314Z", "example_sentence": "The narrow-minded people in the countryside are not open to new ideas.", "repetition_level": 0}]}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE8jiuJmEvjWAixkLwGz4PUNlCrB32nvS9DFIp	{ielts,writing,task2}	draft	a3848bfb-aeac-4938-a9d0-7484c1da70d9	2025-06-15 09:35:52.386	2025-06-15 09:35:52.386	\N
e8f73617-7c88-4384-9f4c-0dace27582f3	writing	Writing Task 2 : Does workaholism have positive effects?	Nowadays, more people move away from their friends and families for work. Do advantages outweigh the disadvantages?	practice	intermediate	ielts	30	{"task": "Nowadays, more people move away from their friends and families for work. Do advantages outweigh the disadvantages?", "ai_prompt": "You are an expert IELTS writing teacher. You help students to improve their IELTS improve Idea and response Example like Introduction,Body1,Body2,Conclusion.", "resources": {"sample_essay": {"body1": "<p><strong>Admittedly, there may be some consequences when people leave their homes for a new place in search of better job opportunities. </strong><span style=\\"color: rgb(45, 194, 107);\\">One of them is that migrating across the country may emotionally impact migrants and their loved ones. Since life is often centered around established social circles, including families and friends, moving to a new location can result in homesickness and a sense of missing out on important events, potentially causing family members to drift apart over time. This is especially true in Asia, where people often value quality time with their family over socializing with friends. </span><span style=\\"color: rgb(53, 152, 219);\\">On a societal level, moving away for work could potentially cause instability in the labor market in less developed regions. This is because it could be difficult for rural enterprises to find suitable candidates for their job vacancies, eventually compromising their productivity as well as the competitiveness of the local economy.</span></p>", "body2": "\\n        <p><strong>However, despite these disadvantages, the benefits of relocating for work are more significant.</strong><span style=\\"color: rgb(45, 194, 107);\\"> In terms of career prospects, settling down in a new environment could help migrants to have the opportunity to pursue their dreams, which would only be possible by moving away from narrow minded people in the countryside. For example, in Asia, parents and the elderly often emphasize career stability over pursuing one’s passions, which leads to false expectations for their children’s futures, thus suppressing young people’s talents. </span><span style=\\"color: rgb(53, 152, 219);\\">Another benefit could be the opportunity to live in a foreign country, which, in addition to possible higher salaries, enables migrants to pursue jobs that may not be available in their home countries. A case in point is that IT workers stand to benefit greatly from working for major tech corporations in the US.</span></p>", "conclusion": "<p dir=\\"ltr\\">In conclusion, while I acknowledge that relocating for work may pose certain problems relating to migrants' feelings and the rural economy, I am convinced that the advantages in personal and professional growth are far more impactful.</p>", "instruction": "<p>It has become more common for people to relocate to a new city or country for work. <strong>Although this trend may present certain challenges, I believe the resultant benefits far outweigh them.</strong></p>"}, "analysis_guide": "<h2>HƯỚNG DẪN VIẾT BÀI</h2><p>&nbsp;</p><h3><em>Xem livestream giải đề này cùng thầy Phạm Minh Khoa (</em><strong><em>2 lần 9.0</em></strong><em>) <u>tại đây bạn nhé!</u></em></h3><p>&nbsp;</p><h2><strong><u>1. Giải thích đề</u></strong></h2><ul><li><p>Đề bài nói về xu hướng ngày càng nhiều người rời xa bạn bè và gia đình để đi làm việc ở nơi khác. Đề bài yêu cầu bạn cân nhắc xem liệu lợi ích của xu hướng này có lớn hơn những bất lợi hay không.</p></li></ul><ul><li><p>Đây là một chủ đề phổ biến trong thời đại toàn cầu hóa, khi người lao động có xu hướng di chuyển (<strong>relocate</strong>) đến các thành phố lớn hoặc nước ngoài để tìm kiếm cơ hội việc làm tốt hơn. Xu hướng này đặc biệt phổ biến ở các nước đang phát triển, nơi mà sự chênh lệch về cơ hội giữa các vùng miền còn lớn.</p></li></ul><p>&nbsp;</p><h2><strong><u>2. Gợi ý lập luận &amp; phân body</u></strong></h2><ul><li><p>Bạn có thể cho rằng lợi ích lớn hơn hoặc nhỏ hơn so với bất lợi.</p></li><li><p><strong>Trong bài này, chúng mình sẽ lập luận theo cách 40/60 (balanced approach)</strong></p></li><li><p>Chúng mình cho rằng lợi ích lớn hơn nhiều so với bất lợi (<strong>benefits far outweigh them</strong>). Chúng ta sẽ theo hướng này.</p><ul><li><p>Body 1 sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p></li><li><p>Body 2 sẽ thảo luận về những lợi ích đáng kể hơn của việc này.</p></li></ul></li></ul><p>&nbsp;</p><h2><strong><u>3. Gợi ý viết body 1</u></strong></h2><p>Mình sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa (<strong>relocating</strong>) để tìm việc có thể gây ra một số hậu quả (<strong>consequences</strong>) cho người di cư và xã hội.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Di cư (<strong>migrating</strong>) có thể gây tác động về mặt cảm xúc (<strong>emotionally impact</strong>) đối với người di cư và người thân</p><p>&nbsp; ➜ cuộc sống thường xoay quanh các mối quan hệ xã hội đã thiết lập (<strong>established social circles</strong>)&nbsp;</p><p>&nbsp; ➜ chuyển đến nơi mới có thể gây nhớ nhà (<strong>homesickness</strong>) và cảm giác bỏ lỡ các sự kiện quan trọng (<strong>missing out on important events</strong>)</p><p>&nbsp; ➜ có thể làm cho các thành viên gia đình xa cách nhau theo thời gian (<strong>drift apart over time</strong>)</p><p>&nbsp; ➜ đặc biệt đúng ở châu Á, nơi mọi người thường coi trọng thời gian chất lượng với gia đình hơn là giao tiếp xã hội với bạn bè</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Ở cấp độ xã hội (<strong>societal level</strong>), di chuyển đi làm xa có thể gây bất ổn cho thị trường lao động (<strong>instability in the labor market</strong>) ở các vùng kém phát triển hơn</p><p>&nbsp; ➜ doanh nghiệp nông thôn (<strong>rural enterprises</strong>) khó tìm được ứng viên phù hợp cho vị trí tuyển dụng</p><p>&nbsp; ➜ ảnh hưởng đến năng suất (<strong>compromising their productivity</strong>) và khả năng cạnh tranh của nền kinh tế địa phương (<strong>competitiveness of the local economy</strong>)</p><p>&nbsp;</p><h2><strong><u>4. Gợi ý viết body 2</u></strong></h2><p>Mình sẽ bàn về những lợi ích đáng kể của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa để làm việc mang lại những lợi ích đáng kể hơn (<strong>more significant</strong>) bất lợi của nó.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Về triển vọng nghề nghiệp (<strong>career prospects</strong>), định cư ở một môi trường mới (<strong>settling down in a new environment</strong>) giúp người di cư có cơ hội theo đuổi ước mơ (<strong>pursue their dreams</strong>)</p><p>&nbsp; ➜ tránh xa những người có tư tưởng hẹp hòi ở nông thôn (<strong>narrow minded people in the countryside</strong>)</p><p>&nbsp; ➜ ví dụ ở châu Á, cha mẹ và người lớn tuổi thường đề cao sự ổn định nghề nghiệp hơn là theo đuổi đam mê (<strong>pursuing one's passions</strong>)</p><p>&nbsp; ➜ tạo ra kỳ vọng sai lầm về tương lai của con cái (<strong>false expectations for their children's futures</strong>)&nbsp;</p><p>&nbsp; ➜ kìm hãm tài năng của giới trẻ (<strong>suppressing young people's talents</strong>)</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Cơ hội sống ở nước ngoài (<strong>live in a foreign country</strong>)</p><p>&nbsp; ➜ ngoài mức lương có thể cao hơn (<strong>higher salaries</strong>), còn cho phép người di cư theo đuổi những công việc không có sẵn ở quê nhà</p><p>&nbsp; ➜ ví dụ như công nhân IT được hưởng lợi rất nhiều khi làm việc cho các tập đoàn công nghệ lớn ở Mỹ (<strong>major tech corporations in the US</strong>)</p>"}, "vocabulary_list": [{"tags": [], "term": "Narrow-minded", "meaning": ["Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."], "next_review": "2025-06-15T09:38:00.116Z", "example_sentence": "The narrow-minded people in the countryside are not open to new ideas.", "repetition_level": 0}]}		{ielts,writing,task2}	pending	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-15 09:38:34.271	2025-06-15 16:44:38.776	2025-06-12 20:09:41.517
bc68a118-4357-4d04-9f03-cc75cd9a7657	writing	Writing Task 2 : Does workaholism have positive effects?	Nowadays, more people move away from their friends and families for work. Do advantages outweigh the disadvantages?	practice	intermediate	ielts	30	{"task": "Nowadays, more people move away from their friends and families for work. Do advantages outweigh the disadvantages?", "ai_prompt": "You are an expert IELTS writing teacher. You help students to improve their IELTS improve Idea and response Example like Introduction you must follow the rule wokalokhomism talk about social i, ads\\n,Body1,Body2,Conclusion.", "resources": {"sample_essay": {"body1": "<p><strong>Admittedly, there may be some consequences when people leave their homes for a new place in search of better job opportunities. </strong><span style=\\"color: rgb(45, 194, 107);\\">One of them is that migrating across the country may emotionally impact migrants and their loved ones. Since life is often centered around established social circles, including families and friends, moving to a new location can result in homesickness and a sense of missing out on important events, potentially causing family members to drift apart over time. This is especially true in Asia, where people often value quality time with their family over socializing with friends. </span><span style=\\"color: rgb(53, 152, 219);\\">On a societal level, moving away for work could potentially cause instability in the labor market in less developed regions. This is because it could be difficult for rural enterprises to find suitable candidates for their job vacancies, eventually compromising their productivity as well as the competitiveness of the local economy.</span></p>", "body2": "\\n        <p><strong>However, despite these disadvantages, the benefits of relocating for work are more significant.</strong><span style=\\"color: rgb(45, 194, 107);\\"> In terms of career prospects, settling down in a new environment could help migrants to have the opportunity to pursue their dreams, which would only be possible by moving away from narrow minded people in the countryside. For example, in Asia, parents and the elderly often emphasize career stability over pursuing one’s passions, which leads to false expectations for their children’s futures, thus suppressing young people’s talents. </span><span style=\\"color: rgb(53, 152, 219);\\">Another benefit could be the opportunity to live in a foreign country, which, in addition to possible higher salaries, enables migrants to pursue jobs that may not be available in their home countries. A case in point is that IT workers stand to benefit greatly from working for major tech corporations in the US.</span></p>", "conclusion": "<p dir=\\"ltr\\">In conclusion, while I acknowledge that relocating for work may pose certain problems relating to migrants' feelings and the rural economy, I am convinced that the advantages in personal and professional growth are far more impactful.</p>", "instruction": "<p>It has become more common for people to relocate to a new city or country for work. <strong>Although this trend may present certain challenges, I believe the resultant benefits far outweigh them.</strong></p>"}, "analysis_guide": "<h2>HƯỚNG DẪN VIẾT BÀI</h2><p>&nbsp;</p><h3><em>Xem livestream giải đề này cùng thầy Phạm Minh Khoa (</em><strong><em>2 lần 9.0</em></strong><em>) <u>tại đây bạn nhé!</u></em></h3><p>&nbsp;</p><h2><strong><u>1. Giải thích đề</u></strong></h2><ul><li><p>Đề bài nói về xu hướng ngày càng nhiều người rời xa bạn bè và gia đình để đi làm việc ở nơi khác. Đề bài yêu cầu bạn cân nhắc xem liệu lợi ích của xu hướng này có lớn hơn những bất lợi hay không.</p></li></ul><ul><li><p>Đây là một chủ đề phổ biến trong thời đại toàn cầu hóa, khi người lao động có xu hướng di chuyển (<strong>relocate</strong>) đến các thành phố lớn hoặc nước ngoài để tìm kiếm cơ hội việc làm tốt hơn. Xu hướng này đặc biệt phổ biến ở các nước đang phát triển, nơi mà sự chênh lệch về cơ hội giữa các vùng miền còn lớn.</p></li></ul><p>&nbsp;</p><h2><strong><u>2. Gợi ý lập luận &amp; phân body</u></strong></h2><ul><li><p>Bạn có thể cho rằng lợi ích lớn hơn hoặc nhỏ hơn so với bất lợi.</p></li><li><p><strong>Trong bài này, chúng mình sẽ lập luận theo cách 40/60 (balanced approach)</strong></p></li><li><p>Chúng mình cho rằng lợi ích lớn hơn nhiều so với bất lợi (<strong>benefits far outweigh them</strong>). Chúng ta sẽ theo hướng này.</p><ul><li><p>Body 1 sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p></li><li><p>Body 2 sẽ thảo luận về những lợi ích đáng kể hơn của việc này.</p></li></ul></li></ul><p>&nbsp;</p><h2><strong><u>3. Gợi ý viết body 1</u></strong></h2><p>Mình sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa (<strong>relocating</strong>) để tìm việc có thể gây ra một số hậu quả (<strong>consequences</strong>) cho người di cư và xã hội.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Di cư (<strong>migrating</strong>) có thể gây tác động về mặt cảm xúc (<strong>emotionally impact</strong>) đối với người di cư và người thân</p><p>&nbsp; ➜ cuộc sống thường xoay quanh các mối quan hệ xã hội đã thiết lập (<strong>established social circles</strong>)&nbsp;</p><p>&nbsp; ➜ chuyển đến nơi mới có thể gây nhớ nhà (<strong>homesickness</strong>) và cảm giác bỏ lỡ các sự kiện quan trọng (<strong>missing out on important events</strong>)</p><p>&nbsp; ➜ có thể làm cho các thành viên gia đình xa cách nhau theo thời gian (<strong>drift apart over time</strong>)</p><p>&nbsp; ➜ đặc biệt đúng ở châu Á, nơi mọi người thường coi trọng thời gian chất lượng với gia đình hơn là giao tiếp xã hội với bạn bè</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Ở cấp độ xã hội (<strong>societal level</strong>), di chuyển đi làm xa có thể gây bất ổn cho thị trường lao động (<strong>instability in the labor market</strong>) ở các vùng kém phát triển hơn</p><p>&nbsp; ➜ doanh nghiệp nông thôn (<strong>rural enterprises</strong>) khó tìm được ứng viên phù hợp cho vị trí tuyển dụng</p><p>&nbsp; ➜ ảnh hưởng đến năng suất (<strong>compromising their productivity</strong>) và khả năng cạnh tranh của nền kinh tế địa phương (<strong>competitiveness of the local economy</strong>)</p><p>&nbsp;</p><h2><strong><u>4. Gợi ý viết body 2</u></strong></h2><p>Mình sẽ bàn về những lợi ích đáng kể của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa để làm việc mang lại những lợi ích đáng kể hơn (<strong>more significant</strong>) bất lợi của nó.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Về triển vọng nghề nghiệp (<strong>career prospects</strong>), định cư ở một môi trường mới (<strong>settling down in a new environment</strong>) giúp người di cư có cơ hội theo đuổi ước mơ (<strong>pursue their dreams</strong>)</p><p>&nbsp; ➜ tránh xa những người có tư tưởng hẹp hòi ở nông thôn (<strong>narrow minded people in the countryside</strong>)</p><p>&nbsp; ➜ ví dụ ở châu Á, cha mẹ và người lớn tuổi thường đề cao sự ổn định nghề nghiệp hơn là theo đuổi đam mê (<strong>pursuing one's passions</strong>)</p><p>&nbsp; ➜ tạo ra kỳ vọng sai lầm về tương lai của con cái (<strong>false expectations for their children's futures</strong>)&nbsp;</p><p>&nbsp; ➜ kìm hãm tài năng của giới trẻ (<strong>suppressing young people's talents</strong>)</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Cơ hội sống ở nước ngoài (<strong>live in a foreign country</strong>)</p><p>&nbsp; ➜ ngoài mức lương có thể cao hơn (<strong>higher salaries</strong>), còn cho phép người di cư theo đuổi những công việc không có sẵn ở quê nhà</p><p>&nbsp; ➜ ví dụ như công nhân IT được hưởng lợi rất nhiều khi làm việc cho các tập đoàn công nghệ lớn ở Mỹ (<strong>major tech corporations in the US</strong>)</p>"}, "vocabulary_list": [{"tags": [], "term": "Narrow-minded", "meaning": ["Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."], "next_review": "2025-06-15T09:38:00.116Z", "example_sentence": "The narrow-minded people in the countryside are not open to new ideas.", "repetition_level": 0}]}		{ielts,writing,task2}	pending	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-15 09:43:13.256	2025-06-15 16:44:41.933	2025-06-12 20:09:41.517
dd06023b-29b4-49e7-8d4c-7c15602d2ed5	reading	Online Shopping	This passage helps learners practice reading about common social topics such as consumer behavior, online habits, and technology, useful for IELTS General Training.	practice	beginner	ielts	30	{"text": "<p>Many people prefer online shopping because it is convenient and time-saving. You can compare prices, read product reviews, and make purchases without leaving your home. However, some people worry about product quality and delivery delays. Despite these concerns, the number of online shoppers is increasing every year, especially during holidays and sales events.</p>", "questions": [{"id": "1", "question": "Why do people like online shopping?", "answer_list": [{"answer": "It is more expensive"}, {"answer": "It is difficult to use"}, {"answer": " It saves time and is convenient"}, {"answer": "It has fewer products"}], "is_bookmark": false, "right_answer": "It saves time and is convenient"}, {"id": "2", "question": "What is one problem with online shopping?", "answer_list": [{"answer": "Products arrive too early"}, {"answer": "There are too many stores"}, {"answer": "People forget to shop"}, {"answer": "Product quality and delivery issues"}], "is_bookmark": false, "right_answer": "Product quality and delivery issues"}, {"id": "3", "question": "When do more people shop online?", "answer_list": [{"answer": "During exam season"}, {"answer": "During holidays and sales"}, {"answer": "During weekdays only"}, {"answer": "On rainy days"}], "is_bookmark": false, "right_answer": "During holidays and sales"}], "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE7iARUbkj3sOcbnR56CaAY2BeNhWvkqdE8GJU	{ielts,reading,office,policy}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-13 05:34:49.268	2025-06-15 18:39:12.792	\N
bdddc4ff-00c2-429b-94c3-30cc5eddd0f9	listening	Environment and Pollution	This topic helps learners understand environmental problems like pollution, deforestation, and climate change. It includes academic and technical vocabulary used in IELTS.	test	advanced	ielts	30	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEdvPAawg1AZEoB8z6whvLUr0MbRCXFyIa9Yct", "questions": [{"id": "1", "question": "What is one of the biggest threats mentioned in the passage?", "answer_list": [{"answer": "Unemployment"}, {"answer": "War"}, {"answer": "Pollution"}, {"answer": "Inflation"}], "is_bookmark": false, "right_answer": "Pollution"}, {"id": "2", "question": "What does plastic pollution harm?", "answer_list": [{"answer": "Mountains"}, {"answer": "Animals in forests"}, {"answer": "Marine life "}, {"answer": "Trees"}], "is_bookmark": false, "right_answer": "Marine life"}, {"id": "3", "question": "What are some solutions mentioned?", "answer_list": [{"answer": "Building more factories"}, {"answer": "Using private cars more"}, {"answer": "Reducing waste and using public transport"}, {"answer": "Ignoring the problem"}], "is_bookmark": false, "right_answer": "Reducing waste and using public transport"}], "youtube_embed_url": "https://www.youtube.com/embed/58i-0Kul26I"}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE0ZxLgMALkEGeuFJw8VAQ4l70otINUsmHZXpY	{ielts,listening,café,food,healthy-eating}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-13 05:25:12.166	2025-06-15 18:37:29.343	\N
d5fea014-c5be-4bc3-b014-98011f389926	listening	The coffee meal	Practice listening to a short talk about a woman's favorite coffee meal and what she eats during it.	test	beginner	toeic	40	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEoiuedChqkfyFUgPoQlZjbMtGEYNc7816e0Ds", "questions": [{"id": "1", "question": "What time does Emma usually have her coffee meal?", "answer_list": [{"answer": "With milk"}, {"answer": "With sugar"}, {"answer": "With milk and sugar"}, {"answer": "Black, no sugar or milk"}], "is_bookmark": false, "right_answer": "Black, no sugar or milk"}, {"id": "2", "question": "What does she often eat with her coffee?", "answer_list": [{"answer": "A hamburger"}, {"answer": "Croissant or a small sandwich"}, {"answer": "Fried rice"}, {"answer": "Noodles and soup"}], "is_bookmark": false, "right_answer": "Croissant or a small sandwich"}, {"id": "3", "question": "What does she eat when she is very hungry?", "answer_list": [{"answer": "Chocolate bar"}, {"answer": "Toast and butter"}, {"answer": "Banana bread or a muffin"}, {"answer": "Granola"}], "is_bookmark": false, "right_answer": "Banana bread or a muffin"}], "youtube_embed_url": "https://www.youtube.com/embed/58i-0Kul26I"}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEPfWNIFjjNeD0nV4vhCrzWMGKXOHdZtkyig69	{}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-05-22 14:45:57.123	2025-06-15 18:38:01.804	\N
9a5cb713-ae34-4985-973d-645fb5741fd8	reading	A Day at School	This reading passage is designed for learners to practice understanding simple daily activities and basic sentence structures, commonly found in Part 1 of the IELTS test.	practice	beginner	ielts	30	{"text": "<p><strong>From:</strong> Anna<br><strong>To:</strong> Sarah<br><strong>Subject:</strong> My First Day at School</p><p>Hi Sarah,</p><p>I started school this week, and it was so exciting! On the first day, I woke up early and put on my new school uniform. My mom made me a yummy breakfast – eggs and toast – and then she took me to school.</p><p>When I arrived, I saw many children in the school yard. Some looked nervous, but others were happy and laughing. I met my new teacher, <strong>Ms. Lisa</strong>. She smiled and said, <em>“Welcome to class, Anna!”</em> She is very kind and friendly.</p><p>In class, we sat in a circle and introduced ourselves. I met <strong>Tom</strong> and <strong>Lily</strong>, who sit next to me. We became friends quickly. During break time, we played tag and hide-and-seek. At lunch, we ate together in the cafeteria.</p><p>In the afternoon, we had our first <strong>English</strong> lesson. Ms. Lisa taught us a fun song with actions. It was about animals, and we all sang together. I really liked it!</p><p>I can’t wait to go back tomorrow.<br>Write soon and tell me about your school!</p><p><strong>Love,</strong><br>Anna</p>", "questions": [{"id": "1", "question": "Who is Anna’s teacher?", "answer_list": [{"answer": "Mr. John"}, {"answer": "Ms. Lisa"}, {"answer": "Mr. Peter"}, {"answer": "Ms. Linda"}], "is_bookmark": false, "right_answer": "Ms. Lisa"}, {"id": "2", "question": "How many new friends did Anna make?", "answer_list": [{"answer": "One"}, {"answer": "Three"}, {"answer": "Two"}, {"answer": "Four"}], "is_bookmark": false, "right_answer": "Two"}, {"id": "3", "question": "What is Anna’s favorite subject?", "answer_list": [{"answer": "Math"}, {"answer": "Science"}, {"answer": "History"}, {"answer": "English "}], "is_bookmark": false, "right_answer": "English"}], "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEbKO3Vlfu4K3eP5VyfoadWZO0tDN7jIXAc1GS	{ielts,reading,office,policy}	published	a001fa67-2813-41a2-af2a-423d3c743198	2025-05-23 05:35:52.505	2025-06-15 18:39:01.027	\N
8be33d9e-19db-4a65-a429-5d9ceda3a42e	reading	Office Policy Update	A reading comprehension exercise about office attendance policy updates	practice	beginner	toeic	30	{"text": "<p>To: All Staff </p><p>From: Human Resources Department </p><p>Subject: Updated Office Attendance Policy Dear Employees, We would like to inform you of an important update to our attendance policy. Starting next Monday, all employees must clock in using the new digital attendance system installed at the main entrance. This system will automatically record your arrival and departure times. Please ensure that you arrive no later than 9:00 A.M. and do not leave before 5:00 P.M. without prior approval from your supervisor. Employees who fail to follow this procedure three times within a month may be subject to a warning. If you have any questions, please contact the HR department.</p>", "questions": [{"id": "1", "question": "What is the main purpose of this email?", "answer_list": [{"answer": "To announce a new employee benefit"}, {"answer": "To introduce a new attendance system"}, {"answer": "To promote an employee training session"}, {"answer": "To notify about a holiday schedule"}], "is_bookmark": false, "right_answer": "To introduce a new attendance system"}, {"id": "2", "question": "When will the new system be implemented?", "answer_list": [{"answer": "Tomorrow"}, {"answer": "Next Monday"}, {"answer": "This Friday"}, {"answer": "Next month"}], "is_bookmark": false, "right_answer": "Next Monday"}, {"id": "3", "question": "What will happen if an employee fails to follow the policy three times in a month?", "answer_list": [{"answer": "They will be fined"}, {"answer": "They will lose a bonus"}, {"answer": "They may receive a warning"}, {"answer": "They must attend a training"}], "is_bookmark": false, "right_answer": "They may receive a warning"}, {"id": "4", "question": "Where is the attendance system located?", "answer_list": [{"answer": "In each department"}, {"answer": "At the front desk"}, {"answer": "Online via mobile app"}, {"answer": "At the main entrance"}], "is_bookmark": false, "right_answer": "At the main entrance"}], "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEKhvh2zm42r1JtFYhm7TvyWPIGlf4aLXoexOZ	{ielts,reading,office,policy}	pending	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-16 10:16:42.697	2025-06-16 10:17:03.346	2025-06-16 06:44:34.879
2871b265-2347-4da4-b440-59d9769640a1	writing	Does workaholism have positive effects?	Nowadays, more people move away from their friends and families for work. Do advantages outweigh the disadvantages?	practice	intermediate	ielts	30	{"task": "Nowadays, more people move away from their friends and families for work. Do advantages outweigh the disadvantages?", "ai_prompt": "Bạn là trợ lý viết bài IELTS Writing Task 2 chuyên nghiệp.\\nChủ đề: \\"Does workaholism have positive effects?\\"\\nBạn phải:\\n- Hướng dẫn hoặc đánh giá các bài luận dựa trên chính chủ đề này.\\n- Tập trung vào đúng nghĩa của \\"chứng nghiện công việc\\" (làm việc quá sức một cách cưỡng bức, không lành mạnh)\\n- Đề cập đến cả tác động tích cực và tiêu cực đối với cá nhân và xã hội (ví dụ: năng suất, sức khỏe, các mối quan hệ, sự đổi mới).\\n\\nĐánh giá hoặc hướng dẫn bằng cách sử dụng 4 tiêu chí IELTS sau:\\n1. **Câu trả lời cho bài tập**: Học sinh có nêu rõ và phát triển quan điểm có liên quan về chứng nghiện công việc bằng các ví dụ cụ thể không?\\n2. **Sự mạch lạc và gắn kết**: Bài luận có được tổ chức tốt với cấu trúc rõ ràng và chuyển tiếp hợp lý không?\\n3. **Nguồn từ vựng**: Học sinh có sử dụng từ vựng chủ đề chính xác không (ví dụ: kiệt sức, karoshi, nghịch lý năng suất)?\\n4. **Phạm vi và độ chính xác của ngữ pháp**: Học sinh có sử dụng các cấu trúc câu đa dạng và chính xác không?\\n\\nTập trung vào việc giúp học sinh phân biệt *nghiện công việc* với *nỗ lực hiệu quả*, và khám phá cả lợi ích ngắn hạn và hậu quả dài hạn.\\n", "resources": {"sample_essay": {"body1": "<p><strong>Admittedly, there may be some consequences when people leave their homes for a new place in search of better job opportunities. </strong><span style=\\"color: rgb(45, 194, 107);\\">One of them is that migrating across the country may emotionally impact migrants and their loved ones. Since life is often centered around established social circles, including families and friends, moving to a new location can result in homesickness and a sense of missing out on important events, potentially causing family members to drift apart over time. This is especially true in Asia, where people often value quality time with their family over socializing with friends. </span><span style=\\"color: rgb(53, 152, 219);\\">On a societal level, moving away for work could potentially cause instability in the labor market in less developed regions. This is because it could be difficult for rural enterprises to find suitable candidates for their job vacancies, eventually compromising their productivity as well as the competitiveness of the local economy.</span></p>", "body2": "\\n        <p><strong>However, despite these disadvantages, the benefits of relocating for work are more significant.</strong><span style=\\"color: rgb(45, 194, 107);\\"> In terms of career prospects, settling down in a new environment could help migrants to have the opportunity to pursue their dreams, which would only be possible by moving away from narrow minded people in the countryside. For example, in Asia, parents and the elderly often emphasize career stability over pursuing one’s passions, which leads to false expectations for their children’s futures, thus suppressing young people’s talents. </span><span style=\\"color: rgb(53, 152, 219);\\">Another benefit could be the opportunity to live in a foreign country, which, in addition to possible higher salaries, enables migrants to pursue jobs that may not be available in their home countries. A case in point is that IT workers stand to benefit greatly from working for major tech corporations in the US.</span></p>", "conclusion": "<p dir=\\"ltr\\">In conclusion, while I acknowledge that relocating for work may pose certain problems relating to migrants' feelings and the rural economy, I am convinced that the advantages in personal and professional growth are far more impactful.</p>", "instruction": "<p>It has become more common for people to relocate to a new city or country for work. <strong>Although this trend may present certain challenges, I believe the resultant benefits far outweigh them.</strong></p>"}, "analysis_guide": "<h2>HƯỚNG DẪN VIẾT BÀI</h2><p>&nbsp;</p><h3><em>Xem livestream giải đề này cùng thầy Phạm Minh Khoa (</em><strong><em>2 lần 9.0</em></strong><em>) <u>tại đây bạn nhé!</u></em></h3><p>&nbsp;</p><h2><strong><u>1. Giải thích đề</u></strong></h2><ul><li><p>Đề bài nói về xu hướng ngày càng nhiều người rời xa bạn bè và gia đình để đi làm việc ở nơi khác. Đề bài yêu cầu bạn cân nhắc xem liệu lợi ích của xu hướng này có lớn hơn những bất lợi hay không.</p></li></ul><ul><li><p>Đây là một chủ đề phổ biến trong thời đại toàn cầu hóa, khi người lao động có xu hướng di chuyển (<strong>relocate</strong>) đến các thành phố lớn hoặc nước ngoài để tìm kiếm cơ hội việc làm tốt hơn. Xu hướng này đặc biệt phổ biến ở các nước đang phát triển, nơi mà sự chênh lệch về cơ hội giữa các vùng miền còn lớn.</p></li></ul><p>&nbsp;</p><h2><strong><u>2. Gợi ý lập luận &amp; phân body</u></strong></h2><ul><li><p>Bạn có thể cho rằng lợi ích lớn hơn hoặc nhỏ hơn so với bất lợi.</p></li><li><p><strong>Trong bài này, chúng mình sẽ lập luận theo cách 40/60 (balanced approach)</strong></p></li><li><p>Chúng mình cho rằng lợi ích lớn hơn nhiều so với bất lợi (<strong>benefits far outweigh them</strong>). Chúng ta sẽ theo hướng này.</p><ul><li><p>Body 1 sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p></li><li><p>Body 2 sẽ thảo luận về những lợi ích đáng kể hơn của việc này.</p></li></ul></li></ul><p>&nbsp;</p><h2><strong><u>3. Gợi ý viết body 1</u></strong></h2><p>Mình sẽ bàn về những bất lợi của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa (<strong>relocating</strong>) để tìm việc có thể gây ra một số hậu quả (<strong>consequences</strong>) cho người di cư và xã hội.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Di cư (<strong>migrating</strong>) có thể gây tác động về mặt cảm xúc (<strong>emotionally impact</strong>) đối với người di cư và người thân</p><p>&nbsp; ➜ cuộc sống thường xoay quanh các mối quan hệ xã hội đã thiết lập (<strong>established social circles</strong>)&nbsp;</p><p>&nbsp; ➜ chuyển đến nơi mới có thể gây nhớ nhà (<strong>homesickness</strong>) và cảm giác bỏ lỡ các sự kiện quan trọng (<strong>missing out on important events</strong>)</p><p>&nbsp; ➜ có thể làm cho các thành viên gia đình xa cách nhau theo thời gian (<strong>drift apart over time</strong>)</p><p>&nbsp; ➜ đặc biệt đúng ở châu Á, nơi mọi người thường coi trọng thời gian chất lượng với gia đình hơn là giao tiếp xã hội với bạn bè</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Ở cấp độ xã hội (<strong>societal level</strong>), di chuyển đi làm xa có thể gây bất ổn cho thị trường lao động (<strong>instability in the labor market</strong>) ở các vùng kém phát triển hơn</p><p>&nbsp; ➜ doanh nghiệp nông thôn (<strong>rural enterprises</strong>) khó tìm được ứng viên phù hợp cho vị trí tuyển dụng</p><p>&nbsp; ➜ ảnh hưởng đến năng suất (<strong>compromising their productivity</strong>) và khả năng cạnh tranh của nền kinh tế địa phương (<strong>competitiveness of the local economy</strong>)</p><p>&nbsp;</p><h2><strong><u>4. Gợi ý viết body 2</u></strong></h2><p>Mình sẽ bàn về những lợi ích đáng kể của việc di chuyển đi làm xa.</p><p>Cấu trúc: Topic Sentence ➜ Supporting Idea 1 ➜ Supporting idea 2</p><h3>&nbsp;✦ <u>Topic sentence:</u></h3><p>Việc di chuyển đi xa để làm việc mang lại những lợi ích đáng kể hơn (<strong>more significant</strong>) bất lợi của nó.</p><h3>&nbsp;✦ <u>Supporting idea 1:</u></h3><p>Về triển vọng nghề nghiệp (<strong>career prospects</strong>), định cư ở một môi trường mới (<strong>settling down in a new environment</strong>) giúp người di cư có cơ hội theo đuổi ước mơ (<strong>pursue their dreams</strong>)</p><p>&nbsp; ➜ tránh xa những người có tư tưởng hẹp hòi ở nông thôn (<strong>narrow minded people in the countryside</strong>)</p><p>&nbsp; ➜ ví dụ ở châu Á, cha mẹ và người lớn tuổi thường đề cao sự ổn định nghề nghiệp hơn là theo đuổi đam mê (<strong>pursuing one's passions</strong>)</p><p>&nbsp; ➜ tạo ra kỳ vọng sai lầm về tương lai của con cái (<strong>false expectations for their children's futures</strong>)&nbsp;</p><p>&nbsp; ➜ kìm hãm tài năng của giới trẻ (<strong>suppressing young people's talents</strong>)</p><h3>&nbsp;✦ <u>Supporting idea 2:</u></h3><p>Cơ hội sống ở nước ngoài (<strong>live in a foreign country</strong>)</p><p>&nbsp; ➜ ngoài mức lương có thể cao hơn (<strong>higher salaries</strong>), còn cho phép người di cư theo đuổi những công việc không có sẵn ở quê nhà</p><p>&nbsp; ➜ ví dụ như công nhân IT được hưởng lợi rất nhiều khi làm việc cho các tập đoàn công nghệ lớn ở Mỹ (<strong>major tech corporations in the US</strong>)</p>"}, "vocabulary_list": [{"tags": [], "term": "Narrow-minded", "meaning": ["Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."], "next_review": "2025-06-16T10:37:26.765Z", "example_sentence": "The narrow-minded people in the countryside are not open to new ideas.", "repetition_level": 0}]}		{ielts,writing,task2}	published	a3848bfb-aeac-4938-a9d0-7484c1da70d9	2025-06-16 10:37:39.453	2025-06-16 10:45:19.152	2025-06-16 06:44:34.879
\.


--
-- Data for Name: LessonSubmission; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LessonSubmission" (id, lesson_id, user_id, submission_type, status, content, feedback, tokens_used, submitted_at, graded_at, graded_by, created_at, updated_at, deleted_at) FROM stdin;
eb2907e2-2f6b-4bef-8166-f94ac4805307	d5fea014-c5be-4bc3-b014-98011f389926	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	listening	submitted	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEIi23FhqP0S9vF1zWsX4manbGgQOe8ilp7DAd", "question_list": [{"id": "1", "question": "What did the speaker order?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "A grilled chicken salad", "selected_answer": "A chicken sandwich"}, {"id": "2", "question": "Why did the speaker ask for the dressing on the side?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "They are trying to eat healthier", "selected_answer": "They are allergic to it"}, {"id": "3", "question": "How much did the speaker pay for the meal?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "$10.50", "selected_answer": "$9.75"}]}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 3, "incorrectAnswers": 3}	0	2025-05-23 05:24:02.736	\N	\N	2025-05-23 05:24:02.738	2025-05-23 05:24:02.738	\N
5d7df219-9792-4bd5-a9b4-c4ba33e1f6cd	0c2eba37-b8ec-498f-b15a-4c7fe64bcc63	50285181-4b29-40cb-9c9c-fde1b1491419	listening	submitted	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEvc8zbXPeW0cGDJpkT6zlN591AiIjYaRObtq7", "question_list": [{"id": "1", "question": "What did the speaker order?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "A grilled chicken salad", "selected_answer": "A grilled chicken salad"}, {"id": "2", "question": "Why did the speaker ask for the dressing on the side?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "They are trying to eat healthier", "selected_answer": "They don't like the taste"}, {"id": "3", "question": "How much did the speaker pay for the meal?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "$10.50", "selected_answer": "$11.20"}]}	{"accuracy": 33.33, "correctAnswers": 1, "totalQuestions": 3, "incorrectAnswers": 2}	0	2025-06-09 09:43:06.863	\N	\N	2025-06-09 09:43:06.865	2025-06-09 09:43:06.865	\N
d497b09b-b417-4b99-9a48-70653dcf15fd	c74e98e2-e13f-4e3f-94b3-1479d1cfb657	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	reading	submitted	{"text": "To: All Staff\\nFrom: Human Resources Department\\nSubject: Updated Office Attendance Policy\\n\\nDear Employees,\\n\\nWe would like to inform you of an important update to our attendance policy. Starting next Monday, all employees are required to clock in using the new digital attendance system installed at the main entrance.\\n\\nThis system will automatically record your arrival and departure times. Please ensure that you arrive no later than 9:00 A.M. and do not leave before 5:00 P.M. without prior approval from your supervisor.\\n\\nAny employee who fails to follow this procedure three times within a month may be subject to a warning.\\n\\nIf you have any questions, please contact the HR department.", "questions": [{"id": "1", "question": "What is the main purpose of this email?", "bookmarked": false, "answer_list": [{"answer": "To announce a new employee benefit"}, {"answer": "To introduce a new attendance system"}, {"answer": "To promote an employee training session"}, {"answer": "To notify about a holiday schedule"}], "right_answer": "To introduce a new attendance system", "selected_answer": "To announce a new employee benefit"}, {"id": "2", "question": "When will the new system be implemented?", "bookmarked": false, "answer_list": [{"answer": "Tomorrow"}, {"answer": "Next Monday"}, {"answer": "This Friday"}, {"answer": "Next month"}], "right_answer": "Next Monday", "selected_answer": "Tomorrow"}, {"id": "3", "question": "What will happen if an employee fails to follow the policy three times in a month?", "bookmarked": false, "answer_list": [{"answer": "They will be fined"}, {"answer": "They will lose a bonus"}, {"answer": "They may receive a warning"}, {"answer": "They must attend a training"}], "right_answer": "They may receive a warning", "selected_answer": "They will be fined"}, {"id": "4", "question": "Where is the attendance system located?", "bookmarked": false, "answer_list": [{"answer": "In each department"}, {"answer": "At the front desk"}, {"answer": "Online via mobile app"}, {"answer": "At the main entrance"}], "right_answer": "At the main entrance", "selected_answer": "In each department"}]}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 4, "incorrectAnswers": 4}	0	2025-05-23 05:23:23.664	\N	\N	2025-05-23 05:23:23.665	2025-05-23 05:23:23.665	\N
435d1060-72ce-45a8-b07b-67b958e36a98	9a5cb713-ae34-4985-973d-645fb5741fd8	50285181-4b29-40cb-9c9c-fde1b1491419	reading	submitted	{"text": "<p>To: All Staff </p><p>From: Human Resources Department </p><p>Subject: Updated Office Attendance Policy Dear Employees, We would like to inform you of an important update to our attendance policy. Starting next Monday, all employees must clock in using the new digital attendance system installed at the main entrance. This system will automatically record your arrival and departure times. Please ensure that you arrive no later than 9:00 A.M. and do not leave before 5:00 P.M. without prior approval from your supervisor. Employees who fail to follow this procedure three times within a month may be subject to a warning. If you have any questions, please contact the HR department.</p>", "questions": [{"id": "1", "question": "What is the main purpose of this email?", "bookmarked": false, "answer_list": [{"answer": "To announce a new employee benefit"}, {"answer": "To introduce a new attendance system"}, {"answer": "To promote an employee training session"}, {"answer": "To notify about a holiday schedule"}], "right_answer": "To introduce a new attendance system", "selected_answer": "To promote an employee training session"}, {"id": "2", "question": "When will the new system be implemented?", "bookmarked": false, "answer_list": [{"answer": "Tomorrow"}, {"answer": "Next Monday"}, {"answer": "This Friday"}, {"answer": "Next month"}], "right_answer": "Next Monday", "selected_answer": "Next Monday"}, {"id": "3", "question": "What will happen if an employee fails to follow the policy three times in a month?", "bookmarked": false, "answer_list": [{"answer": "They will be fined"}, {"answer": "They will lose a bonus"}, {"answer": "They may receive a warning"}, {"answer": "They must attend a training"}], "right_answer": "They may receive a warning", "selected_answer": "They will lose a bonus"}, {"id": "4", "question": "Where is the attendance system located?", "bookmarked": false, "answer_list": [{"answer": "In each department"}, {"answer": "At the front desk"}, {"answer": "Online via mobile app"}, {"answer": "At the main entrance"}], "right_answer": "At the main entrance", "selected_answer": "Online via mobile app"}]}	{"accuracy": 25, "correctAnswers": 1, "totalQuestions": 4, "incorrectAnswers": 3}	0	2025-06-09 09:41:31.898	\N	\N	2025-06-09 09:41:31.9	2025-06-09 09:41:31.9	\N
043b2d39-5a55-484e-a89d-880f82c9a052	c74e98e2-e13f-4e3f-94b3-1479d1cfb657	50285181-4b29-40cb-9c9c-fde1b1491419	reading	submitted	{"text": "To: All Staff\\nFrom: Human Resources Department\\nSubject: Updated Office Attendance Policy\\n\\nDear Employees,\\n\\nWe would like to inform you of an important update to our attendance policy. Starting next Monday, all employees are required to clock in using the new digital attendance system installed at the main entrance.\\n\\nThis system will automatically record your arrival and departure times. Please ensure that you arrive no later than 9:00 A.M. and do not leave before 5:00 P.M. without prior approval from your supervisor.\\n\\nAny employee who fails to follow this procedure three times within a month may be subject to a warning.\\n\\nIf you have any questions, please contact the HR department.", "questions": [{"id": "1", "question": "What is the main purpose of this email?", "bookmarked": false, "answer_list": [{"answer": "To announce a new employee benefit"}, {"answer": "To introduce a new attendance system"}, {"answer": "To promote an employee training session"}, {"answer": "To notify about a holiday schedule"}], "right_answer": "To introduce a new attendance system", "selected_answer": "To announce a new employee benefit"}, {"id": "2", "question": "When will the new system be implemented?", "bookmarked": false, "answer_list": [{"answer": "Tomorrow"}, {"answer": "Next Monday"}, {"answer": "This Friday"}, {"answer": "Next month"}], "right_answer": "Next Monday", "selected_answer": "Next Monday"}, {"id": "3", "question": "What will happen if an employee fails to follow the policy three times in a month?", "bookmarked": false, "answer_list": [{"answer": "They will be fined"}, {"answer": "They will lose a bonus"}, {"answer": "They may receive a warning"}, {"answer": "They must attend a training"}], "right_answer": "They may receive a warning", "selected_answer": "They may receive a warning"}, {"id": "4", "question": "Where is the attendance system located?", "bookmarked": false, "answer_list": [{"answer": "In each department"}, {"answer": "At the front desk"}, {"answer": "Online via mobile app"}, {"answer": "At the main entrance"}], "right_answer": "At the main entrance", "selected_answer": "In each department"}]}	{"accuracy": 50, "correctAnswers": 2, "totalQuestions": 4, "incorrectAnswers": 2}	0	2025-06-05 14:33:07.252	\N	\N	2025-06-05 14:33:07.254	2025-06-05 14:33:07.254	\N
14db8f85-2140-46fd-9e0f-0142b41c6c71	0c2eba37-b8ec-498f-b15a-4c7fe64bcc63	50285181-4b29-40cb-9c9c-fde1b1491419	listening	submitted	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEvc8zbXPeW0cGDJpkT6zlN591AiIjYaRObtq7", "question_list": [{"id": "1", "question": "What did the speaker order?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "A grilled chicken salad", "selected_answer": "A grilled chicken salad"}, {"id": "2", "question": "Why did the speaker ask for the dressing on the side?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "They are trying to eat healthier", "selected_answer": "They don't like the taste"}, {"id": "3", "question": "How much did the speaker pay for the meal?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "$10.50", "selected_answer": "$10.50"}]}	{"accuracy": 66.67, "correctAnswers": 2, "totalQuestions": 3, "incorrectAnswers": 1}	0	2025-06-05 14:34:08.754	\N	\N	2025-06-05 14:34:08.755	2025-06-05 14:34:08.755	\N
369d7be7-dc4a-4761-9e45-772efdf9e644	b365942d-b625-4bfd-8f2e-394dcfc5fb48	50285181-4b29-40cb-9c9c-fde1b1491419	speaking	submitted	{"topic_text": "Let's practice speaking English", "prompt_text": "Let's practice speaking English", "chat_history": [{"id": "1749735632797", "role": "user", "text": "I love to travel! What places have you visited?", "timestamp": "2025-06-12T13:40:32.797Z"}, {"id": "1749735634946", "role": "bot", "text": "That's fantastic!  I'd love to hear about your travels.  To get us started, what's your favorite type of trip?  Do you prefer relaxing beach vacations, adventurous backpacking trips, or something else entirely?", "timestamp": "2025-06-12T13:40:34.946Z"}]}	\N	10	2025-06-12 13:40:35.326	\N	\N	2025-06-12 13:34:20.878	2025-06-12 13:40:35.327	\N
8b966b91-4823-4280-8976-eea7c1a461fc	b365942d-b625-4bfd-8f2e-394dcfc5fb48	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	speaking	draft	{"prompt": "Let's practice speaking English\\n\\nTopic: \\"Travel and Tourism\\"\\n\\nAsk follow-up questions like:\\n- What places have you visited?\\n- How was your last trip?\\n- Do you prefer traveling alone or with friends?\\n- What country would you like to visit next and why?\\n\\nBackground knowledge to consider: Focus on travel experiences, cultural differences, and common travel vocabulary such as 'hotel', 'sightseeing', 'itinerary', 'passport'.", "messages": [{"role": "user", "content": "I love traveling! What places have you visited?"}, {"role": "assistant", "content": "That's great!  I've been fortunate enough to \\"visit\\" many places through the vast amount of text data I've processed.  It's not the same as experiencing them firsthand, of course, but I've \\"travelled\\" extensively through descriptions of places like the bustling markets of Marrakech, the serene temples of Kyoto, the towering skyscrapers of New York City, and the breathtaking landscapes of the Amazon rainforest.  \\n\\nHow about you? What places have *you* visited?\\n"}, {"role": "user", "content": "Hi"}, {"role": "assistant", "content": "Hi there!  Ready to talk about travel?  Let's continue our conversation.  To get us started, what places have you visited?\\n"}]}	\N	10	\N	\N	\N	2025-06-12 15:42:13.027	2025-06-12 15:44:20.459	\N
e6cbf1f1-8f7a-43ab-a33f-39a956894271	9a5cb713-ae34-4985-973d-645fb5741fd8	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	reading	submitted	{"text": "<p>To: All Staff </p><p>From: Human Resources Department </p><p>Subject: Updated Office Attendance Policy Dear Employees, We would like to inform you of an important update to our attendance policy. Starting next Monday, all employees must clock in using the new digital attendance system installed at the main entrance. This system will automatically record your arrival and departure times. Please ensure that you arrive no later than 9:00 A.M. and do not leave before 5:00 P.M. without prior approval from your supervisor. Employees who fail to follow this procedure three times within a month may be subject to a warning. If you have any questions, please contact the HR department.</p>", "questions": [{"id": "1", "question": "What is the main purpose of this email?", "bookmarked": false, "answer_list": [{"answer": "To announce a new employee benefit"}, {"answer": "To introduce a new attendance system"}, {"answer": "To promote an employee training session"}, {"answer": "To notify about a holiday schedule"}], "right_answer": "To introduce a new attendance system", "selected_answer": "To announce a new employee benefit"}, {"id": "2", "question": "When will the new system be implemented?", "bookmarked": false, "answer_list": [{"answer": "Tomorrow"}, {"answer": "Next Monday"}, {"answer": "This Friday"}, {"answer": "Next month"}], "right_answer": "Next Monday", "selected_answer": "Tomorrow"}, {"id": "3", "question": "What will happen if an employee fails to follow the policy three times in a month?", "bookmarked": false, "answer_list": [{"answer": "They will be fined"}, {"answer": "They will lose a bonus"}, {"answer": "They may receive a warning"}, {"answer": "They must attend a training"}], "right_answer": "They may receive a warning", "selected_answer": "They will be fined"}, {"id": "4", "question": "Where is the attendance system located?", "bookmarked": false, "answer_list": [{"answer": "In each department"}, {"answer": "At the front desk"}, {"answer": "Online via mobile app"}, {"answer": "At the main entrance"}], "right_answer": "At the main entrance", "selected_answer": "In each department"}]}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 4, "incorrectAnswers": 4}	0	2025-06-12 15:45:10.008	\N	\N	2025-06-12 15:45:10.01	2025-06-12 15:45:10.01	\N
df0b1e36-120b-4873-869e-744825163e7e	0c2eba37-b8ec-498f-b15a-4c7fe64bcc63	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	listening	submitted	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEvc8zbXPeW0cGDJpkT6zlN591AiIjYaRObtq7", "question_list": [{"id": "1", "question": "What did the speaker order?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "A grilled chicken salad", "selected_answer": "A chicken sandwich"}, {"id": "2", "question": "Why did the speaker ask for the dressing on the side?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "They are trying to eat healthier", "selected_answer": "They are trying to eat healthier"}, {"id": "3", "question": "How much did the speaker pay for the meal?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "$10.50", "selected_answer": "$11.20"}]}	{"accuracy": 33.33, "correctAnswers": 1, "totalQuestions": 3, "incorrectAnswers": 2}	0	2025-06-12 15:46:15.491	\N	\N	2025-06-12 15:46:15.492	2025-06-12 15:46:15.492	\N
322af7e9-ef40-40c4-bd4d-bc7c5232b8ef	083b2bf6-6532-4657-b7d3-290799122ee5	50285181-4b29-40cb-9c9c-fde1b1491419	speaking	submitted	{"topic_text": "Let's practice speaking English", "prompt_text": "Let's practice speaking English", "chat_history": [{"role": "user", "text": "Hi"}, {"role": "assistant", "text": "Hi!  So, let's talk about travel and tourism.  What are your thoughts on traveling in general?  What comes to mind when you think about travel?\\n"}, {"role": "user", "text": "Ok"}, {"role": "assistant", "text": "Okay, great!  To get us started,  what places have you visited?  And if you've traveled before, tell me a bit about your experience.\\n"}, {"role": "user", "text": "yes"}, {"role": "assistant", "text": "Okay,  \\"yes\\" to what?  Have you travelled before?  If so, what places have you visited?  Let's hear about your travel experiences!\\n"}]}	\N	10	2025-06-12 14:30:13.204	\N	\N	2025-06-12 14:15:49.598	2025-06-12 14:30:13.205	\N
bb16e9c8-b68e-4374-a54c-358d1014dd81	86e747e3-3f19-40cb-a93d-55ad77bf4122	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	writing	draft	{"lesson_id": "86e747e3-3f19-40cb-a93d-55ad77bf4122", "user_data": {"body1": "<p>There are some drawbacks when people move for better job opportunities.</p>", "body2": "<p>However, the benefits, especially in career prospects and personal growth, outweigh the negatives.</p>", "conclusion": "<p>Although relocating may cause issues, the personal and professional gains are far more significant.</p>", "instruction": "<p>Relocating for work is common and offers more benefits than challenges.</p>"}, "chat_history": []}	\N	0	2025-06-12 17:06:52.413	\N	\N	2025-06-12 17:06:52.413	2025-06-12 17:06:52.413	\N
f12b7c1e-dde9-47fe-b53d-55104b5df677	86e747e3-3f19-40cb-a93d-55ad77bf4122	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	writing	draft	{"lesson_id": "86e747e3-3f19-40cb-a93d-55ad77bf4122", "user_data": {"body1": "<p>There are some drawbacks when people move for better job opportunities.</p>", "body2": "<p>However, the benefits, especially in career prospects and personal growth, outweigh the negatives.</p>", "conclusion": "<p>Although relocating may cause issues, the personal and professional gains are far more significant.</p>", "instruction": "<p>Relocating for work is common and offers more benefits than challenges.</p>"}, "chat_history": []}	\N	0	2025-06-12 17:06:55.752	\N	\N	2025-06-12 17:06:55.753	2025-06-12 17:06:55.753	\N
c777c3d7-dd23-45a0-bdf0-bea28c13fa41	b365942d-b625-4bfd-8f2e-394dcfc5fb48	50285181-4b29-40cb-9c9c-fde1b1491419	speaking	submitted	{"topic_text": "Let's practice speaking English", "prompt_text": "Let's practice speaking English", "chat_history": [{"id": "1749759533330", "role": "user", "text": "hi\\n", "timestamp": "2025-06-12T20:18:53.330Z"}, {"id": "1749759536720", "role": "bot", "text": "Hi there!  Ready to talk about travel?  Let's continue our conversation.  What places have you visited?", "timestamp": "2025-06-12T20:18:56.720Z"}]}	\N	10	2025-06-12 20:19:19.081	\N	\N	2025-06-12 20:18:03.633	2025-06-12 20:19:19.083	\N
60fa24e5-5862-4d86-8427-dda49884a5ec	b365942d-b625-4bfd-8f2e-394dcfc5fb48	50285181-4b29-40cb-9c9c-fde1b1491419	speaking	submitted	{"topic_text": "Let's practice speaking English", "prompt_text": "Let's practice speaking English", "chat_history": [{"id": "1749759630095", "role": "user", "text": "Hi", "timestamp": "2025-06-12T20:20:30.095Z"}, {"id": "1749759631802", "role": "bot", "text": "Hi!  So, let's talk about travel and tourism.  What are your thoughts on travel in general?  What kind of experiences are you looking for when you travel?", "timestamp": "2025-06-12T20:20:31.802Z"}, {"id": "1749759657264", "role": "user", "text": "Exicted", "timestamp": "2025-06-12T20:20:57.264Z"}, {"id": "1749759659333", "role": "bot", "text": "Excited, that's great!  What excites you most about travel?  Is it the new cultures you experience, the sightseeing, the adventure, or something else?", "timestamp": "2025-06-12T20:20:59.333Z"}]}	\N	10	2025-06-12 20:21:25.319	\N	\N	2025-06-12 20:20:22.271	2025-06-12 20:21:25.321	\N
c82ec45b-4191-4b96-8033-af3dff5f4a93	86e747e3-3f19-40cb-a93d-55ad77bf4122	50285181-4b29-40cb-9c9c-fde1b1491419	writing	draft	{"lesson_id": "86e747e3-3f19-40cb-a93d-55ad77bf4122", "user_data": {"body1": "<p>There are some drawbacks when people move for better job opportunities.</p>", "body2": "<p>However, the benefits, especially in career prospects and personal growth, outweigh the negatives.</p>", "conclusion": "<p>Although relocating may cause issues, the personal and professional gains are far more significant.</p>", "instruction": "<p>Relocating for work is common and offers more benefits than challenges.</p>"}, "chat_history": []}	\N	0	2025-06-12 20:23:09.652	\N	\N	2025-06-12 20:23:09.653	2025-06-12 20:23:09.653	\N
734bf887-84a9-44a0-884c-084d58358bf7	86e747e3-3f19-40cb-a93d-55ad77bf4122	50285181-4b29-40cb-9c9c-fde1b1491419	writing	scored	{"lesson_id": "86e747e3-3f19-40cb-a93d-55ad77bf4122", "user_data": {"body1": "<p>There are some drawbacks when people move for better job opportunities.</p>", "body2": "<p>However, the benefits, especially in career prospects and personal growth, outweigh the negatives.</p>", "conclusion": "<p>Although relocating may cause issues, the personal and professional gains are far more significant.</p>", "instruction": "<p>Relocating for work is common and offers more benefits than challenges.</p>"}, "chat_history": []}	{"grammar": 6, "corrections": [{"id": "5f026c9b-7e53-43d0-b517-9106e2e43c02", "error": "grammar", "reason": "The text is grammatically incorrect", "position": "26", "sentence": "mon and of", "suggestion": "The correct version of the text"}], "overall_score": 7, "task_response": 6, "lexical_resource": 7, "overall_feedback": "<p>Bài viết có cấu trúc rõ ràng, có điểm mạnh và điểm yếu. Tuy nhiên, cần cải thiện độ trong sáng và cấu trúc của bài viết.</p>", "coherence_cohesion": 8}	0	2025-06-12 20:23:13.702	2025-06-12 20:23:41.772	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-12 20:23:13.703	2025-06-12 20:23:41.773	\N
68014e79-bda7-46b1-8e24-5f4d32084129	b365942d-b625-4bfd-8f2e-394dcfc5fb48	56bb530c-d276-4b58-9d2b-bf3b15d034d8	speaking	draft	{"topic": "Travel and Tourism", "prompt": "Let's practice speaking English", "messages": []}	\N	10	\N	\N	\N	2025-06-13 07:45:19.128	2025-06-13 07:45:19.128	\N
f170ba39-ab5f-4e67-86b6-a214206374b1	083b2bf6-6532-4657-b7d3-290799122ee5	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	speaking	draft	{"topic": "Environmental Issues and Solutions ", "prompt": "Let's practice speaking English", "messages": []}	\N	10	\N	\N	\N	2025-06-13 07:57:28.381	2025-06-13 07:57:28.381	\N
af44e8ed-04d2-40d9-9888-9baecf53d8f7	b365942d-b625-4bfd-8f2e-394dcfc5fb48	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	speaking	draft	{"prompt": "Let's practice speaking English\\n\\nTopic: \\"Travel and Tourism\\"\\n\\nAsk follow-up questions like:\\n- What places have you visited?\\n- How was your last trip?\\n- Do you prefer traveling alone or with friends?\\n- What country would you like to visit next and why?\\n\\nBackground knowledge to consider: Focus on travel experiences, cultural differences, and common travel vocabulary such as 'hotel', 'sightseeing', 'itinerary', 'passport'.", "messages": [{"role": "user", "content": "Hi"}, {"role": "assistant", "content": "Hi!  So, let's talk about travel and tourism.  What's your favorite thing about traveling?\\n"}, {"role": "user", "content": "Hello."}, {"role": "assistant", "content": "Hello!  Let's chat about travel.  To get us started, what places have you visited?\\n"}]}	\N	10	\N	\N	\N	2025-06-13 07:58:21.246	2025-06-13 07:59:28.553	\N
8d677739-d218-47b3-90fe-3099a2fa1b61	9a5cb713-ae34-4985-973d-645fb5741fd8	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	reading	submitted	{"text": "<p><strong>From:</strong> Anna<br><strong>To:</strong> Sarah<br><strong>Subject:</strong> My First Day at School</p><p>Hi Sarah,</p><p>I started school this week, and it was so exciting! On the first day, I woke up early and put on my new school uniform. My mom made me a yummy breakfast – eggs and toast – and then she took me to school.</p><p>When I arrived, I saw many children in the school yard. Some looked nervous, but others were happy and laughing. I met my new teacher, <strong>Ms. Lisa</strong>. She smiled and said, <em>“Welcome to class, Anna!”</em> She is very kind and friendly.</p><p>In class, we sat in a circle and introduced ourselves. I met <strong>Tom</strong> and <strong>Lily</strong>, who sit next to me. We became friends quickly. During break time, we played tag and hide-and-seek. At lunch, we ate together in the cafeteria.</p><p>In the afternoon, we had our first <strong>English</strong> lesson. Ms. Lisa taught us a fun song with actions. It was about animals, and we all sang together. I really liked it!</p><p>I can’t wait to go back tomorrow.<br>Write soon and tell me about your school!</p><p><strong>Love,</strong><br>Anna</p>", "questions": [{"id": "1", "question": "Who is Anna’s teacher?", "bookmarked": true, "answer_list": [{"answer": "Mr. John"}, {"answer": "Ms. Lisa"}, {"answer": "Mr. Peter"}, {"answer": "Ms. Linda"}], "right_answer": "Ms. Lisa", "selected_answer": "Mr. John"}, {"id": "2", "question": "How many new friends did Anna make?", "bookmarked": false, "answer_list": [{"answer": "One"}, {"answer": "Three"}, {"answer": "Two"}, {"answer": "Four"}], "right_answer": "Two", "selected_answer": "One"}, {"id": "3", "question": "What is Anna’s favorite subject?", "bookmarked": false, "answer_list": [{"answer": "Math"}, {"answer": "Science"}, {"answer": "History"}, {"answer": "English "}], "right_answer": "English", "selected_answer": "Math"}]}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 3, "incorrectAnswers": 3}	0	2025-06-13 08:02:33.84	\N	\N	2025-06-13 08:02:33.843	2025-06-13 08:02:33.843	\N
1c308c41-ba4d-40eb-8b28-b1dff4f0bd23	bdddc4ff-00c2-429b-94c3-30cc5eddd0f9	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	listening	submitted	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEdvPAawg1AZEoB8z6whvLUr0MbRCXFyIa9Yct", "question_list": [{"id": "1", "question": "What is one of the biggest threats mentioned in the passage?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Pollution", "selected_answer": "Pollution"}, {"id": "2", "question": "What does plastic pollution harm?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Marine life", "selected_answer": "Marine life "}, {"id": "3", "question": "What are some solutions mentioned?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Reducing waste and using public transport", "selected_answer": "Using private cars more"}]}	{"accuracy": 33.33, "correctAnswers": 1, "totalQuestions": 3, "incorrectAnswers": 2}	0	2025-06-13 08:03:11.117	\N	\N	2025-06-13 08:03:11.119	2025-06-13 08:03:11.119	\N
84f6bf3d-abef-4b04-8d22-b93a3149f04d	86e747e3-3f19-40cb-a93d-55ad77bf4122	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	writing	scored	{"lesson_id": "86e747e3-3f19-40cb-a93d-55ad77bf4122", "user_data": {"body1": "<p>There are some drawbacks when people move for better job opportunities.</p>", "body2": "<p>However, the benefits, especially in career prospects and personal growth, outweigh the negatives.</p>", "conclusion": "<p>Although relocating may cause issues, the personal and professional gains are far more significant.</p>", "instruction": "<p>Relocating for work is common and offers more benefits than challenges.</p>"}, "chat_history": []}	{"grammar": 6, "corrections": [{"id": "f65a6f3b-cb8b-4cac-8689-3533a25b1b0b", "error": "cohesion", "reason": "The text is grammatically incorrect", "position": "34", "sentence": "offers more benefits than challenges.\\n\\n", "suggestion": "The correct version of the text"}], "overall_score": 7, "task_response": 6, "lexical_resource": 7, "overall_feedback": "<p>Bài viết có cấu trúc rõ ràng, có điểm mạnh và điểm yếu. Tuy nhiên, cần cải thiện độ trong sáng và cấu trúc của bài viết.</p>", "coherence_cohesion": 8}	0	2025-06-13 08:25:04.854	2025-06-14 05:29:21.261	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-13 08:25:04.856	2025-06-14 05:29:21.263	\N
5ac8880e-2831-4a6e-ab66-addda1d84f61	ec721b8c-4cbe-439d-b789-5c65e19f5e7f	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	writing	taken	{"lesson_id": "ec721b8c-4cbe-439d-b789-5c65e19f5e7f", "user_data": {"body1": "<p>There are some drawbacks when people move for better job opportunities.</p>", "body2": "<p>However, the benefits, especially in career prospects and personal growth, outweigh the negatives.</p>", "conclusion": "<p>Although relocating may cause issues, the personal and professional gains are far more significant.</p>", "instruction": "<p>Relocating for work is common and offers more benefits than challenges. </p>"}, "chat_history": []}	\N	5	2025-06-13 07:56:52.945	\N	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-13 07:56:52.946	2025-06-15 16:34:34.444	\N
fd721f6b-1e90-4f9b-97e3-dcfc4f5a1324	b365942d-b625-4bfd-8f2e-394dcfc5fb48	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	speaking	draft	{"prompt": "Let's practice speaking English\\n\\nTopic: \\"Travel and Tourism\\"\\n\\nAsk follow-up questions like:\\n- What places have you visited?\\n- How was your last trip?\\n- Do you prefer traveling alone or with friends?\\n- What country would you like to visit next and why?\\n\\nBackground knowledge to consider: Focus on travel experiences, cultural differences, and common travel vocabulary such as 'hotel', 'sightseeing', 'itinerary', 'passport'.", "messages": [{"role": "user", "content": "I love traveling! What places have you visited?"}, {"role": "assistant", "content": "I've been fortunate enough to \\"visit\\" many places virtually, through the vast amount of data I've processed.  That means I've \\"experienced\\" them through photos, videos, articles, and books.  For example, I've explored the bustling markets of Marrakech, the serene temples of Kyoto, and the stunning landscapes of Patagonia.  But I haven't actually *been* there in person.  \\n\\nWhat about you? What places have you visited?  And how was your last trip?\\n"}, {"role": "user", "content": "Hi."}, {"role": "assistant", "content": "Hi there!  Ready to talk about travel?  Let's start with my previous questions: What places have you visited, and how was your last trip?\\n"}]}	\N	10	\N	\N	\N	2025-06-13 08:25:18.88	2025-06-13 08:25:40.18	\N
625952b7-828b-4952-ad8d-93e7b873c60c	9a5cb713-ae34-4985-973d-645fb5741fd8	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	reading	submitted	{"text": "<p><strong>From:</strong> Anna<br><strong>To:</strong> Sarah<br><strong>Subject:</strong> My First Day at School</p><p>Hi Sarah,</p><p>I started school this week, and it was so exciting! On the first day, I woke up early and put on my new school uniform. My mom made me a yummy breakfast – eggs and toast – and then she took me to school.</p><p>When I arrived, I saw many children in the school yard. Some looked nervous, but others were happy and laughing. I met my new teacher, <strong>Ms. Lisa</strong>. She smiled and said, <em>“Welcome to class, Anna!”</em> She is very kind and friendly.</p><p>In class, we sat in a circle and introduced ourselves. I met <strong>Tom</strong> and <strong>Lily</strong>, who sit next to me. We became friends quickly. During break time, we played tag and hide-and-seek. At lunch, we ate together in the cafeteria.</p><p>In the afternoon, we had our first <strong>English</strong> lesson. Ms. Lisa taught us a fun song with actions. It was about animals, and we all sang together. I really liked it!</p><p>I can’t wait to go back tomorrow.<br>Write soon and tell me about your school!</p><p><strong>Love,</strong><br>Anna</p>", "questions": [{"id": "1", "question": "Who is Anna’s teacher?", "bookmarked": true, "answer_list": [{"answer": "Mr. John"}, {"answer": "Ms. Lisa"}, {"answer": "Mr. Peter"}, {"answer": "Ms. Linda"}], "right_answer": "Ms. Lisa", "selected_answer": "Mr. John"}, {"id": "2", "question": "How many new friends did Anna make?", "bookmarked": false, "answer_list": [{"answer": "One"}, {"answer": "Three"}, {"answer": "Two"}, {"answer": "Four"}], "right_answer": "Two", "selected_answer": "Three"}, {"id": "3", "question": "What is Anna’s favorite subject?", "bookmarked": false, "answer_list": [{"answer": "Math"}, {"answer": "Science"}, {"answer": "History"}, {"answer": "English "}], "right_answer": "English", "selected_answer": "Math"}]}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 3, "incorrectAnswers": 3}	0	2025-06-13 08:26:24.817	\N	\N	2025-06-13 08:26:24.819	2025-06-13 08:26:24.819	\N
e6225ebc-b28c-42e7-9bb3-3bbb98756def	bdddc4ff-00c2-429b-94c3-30cc5eddd0f9	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	listening	submitted	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEdvPAawg1AZEoB8z6whvLUr0MbRCXFyIa9Yct", "question_list": [{"id": "1", "question": "What is one of the biggest threats mentioned in the passage?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Pollution", "selected_answer": "War"}, {"id": "2", "question": "What does plastic pollution harm?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Marine life", "selected_answer": "Marine life "}, {"id": "3", "question": "What are some solutions mentioned?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Reducing waste and using public transport", "selected_answer": "Reducing waste and using public transport"}]}	{"accuracy": 33.33, "correctAnswers": 1, "totalQuestions": 3, "incorrectAnswers": 2}	0	2025-06-13 08:26:43.491	\N	\N	2025-06-13 08:26:43.492	2025-06-13 08:26:43.492	\N
a2833b21-280c-4b97-984f-fd712e6c3c67	bdddc4ff-00c2-429b-94c3-30cc5eddd0f9	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	listening	submitted	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEdvPAawg1AZEoB8z6whvLUr0MbRCXFyIa9Yct", "question_list": [{"id": "1", "question": "What is one of the biggest threats mentioned in the passage?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Pollution", "selected_answer": "War"}, {"id": "2", "question": "What does plastic pollution harm?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Marine life", "selected_answer": "Animals in forests"}, {"id": "3", "question": "What are some solutions mentioned?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Reducing waste and using public transport", "selected_answer": "Using private cars more"}]}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 3, "incorrectAnswers": 3}	0	2025-06-13 08:31:32.451	\N	\N	2025-06-13 08:31:32.452	2025-06-13 08:31:32.452	\N
108221a8-4233-45c7-bb53-66d4b35bd372	86e747e3-3f19-40cb-a93d-55ad77bf4122	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	writing	scored	{"lesson_id": "86e747e3-3f19-40cb-a93d-55ad77bf4122", "user_data": {"body1": "<p>There are some drawbacks when people move for better job opportunities.</p>", "body2": "<p>However, the benefits, especially in career prospects and personal growth, outweigh the negatives.</p>", "conclusion": "<p>Although relocating may cause issues, the personal and professional gains are far more significant.</p>", "instruction": "<p>Relocating for work is common and offers more benefits than challenges.</p>"}, "chat_history": []}	{"grammar": 6, "corrections": [{"id": "02d251a2-94df-45b4-9424-c9531850c6c0", "error": "grammar", "reason": "The text is grammatically incorrect", "position": "46", "sentence": "benefits than challenges.", "suggestion": "The correct version of the text"}], "overall_score": 7, "task_response": 6, "lexical_resource": 7, "overall_feedback": "<p>Bài viết có cấu trúc rõ ràng, có điểm mạnh và điểm yếu. Tuy nhiên, cần cải thiện độ trong sáng và cấu trúc của bài viết.</p>", "coherence_cohesion": 8}	0	2025-06-13 08:31:00.933	2025-06-13 08:32:57.417	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-13 08:31:00.935	2025-06-13 08:32:57.419	\N
f91bc9f0-aa9a-4c90-976c-b93684c72978	ec721b8c-4cbe-439d-b789-5c65e19f5e7f	50285181-4b29-40cb-9c9c-fde1b1491419	writing	scored	{"lesson_id": "ec721b8c-4cbe-439d-b789-5c65e19f5e7f", "user_data": {"body1": "<p>There are some drawbacks when people move for better job opportunities.</p>", "body2": "<p>However, the benefits, especially in career prospects and personal growth, outweigh the negatives.</p>", "conclusion": "<p>Although relocating may cause issues, the personal and professional gains are far more significant.</p>", "instruction": "<p>Relocating for work is common and offers more benefits than challenges.</p>"}, "chat_history": []}	{"grammar": 6, "corrections": [{"id": "b390eb2d-ee66-43a6-97bc-4a4d6a54cf57", "error": "cohesion", "reason": "The text is grammatically incorrect", "position": "12", "sentence": "or work is common and offers ", "suggestion": "or work is mommon"}], "overall_score": 5, "task_response": 6, "lexical_resource": 7, "overall_feedback": "<p>Bài viết có cấu trúc rõ ràng, có điểm mạnh và điểm yếu. Tuy nhiên, cần cải thiện độ trong sáng và cấu trúc của bài viết.</p>", "coherence_cohesion": 6}	0	2025-06-15 09:23:03.512	2025-06-15 09:24:19.236	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-15 09:23:03.514	2025-06-15 09:24:19.237	\N
88032c01-c465-4e3d-b284-882aaaace3fd	083b2bf6-6532-4657-b7d3-290799122ee5	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	speaking	draft	{"topic": "Environmental Issues and Solutions ", "prompt": "Let's practice speaking English", "messages": []}	\N	10	\N	\N	\N	2025-06-15 13:33:49.852	2025-06-15 13:33:49.852	\N
883492e3-c5a2-4c9f-8e58-db9bd5c45ed5	d5fea014-c5be-4bc3-b014-98011f389926	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	listening	submitted	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEoiuedChqkfyFUgPoQlZjbMtGEYNc7816e0Ds", "question_list": [{"id": "1", "question": "What time does Emma usually have her coffee meal?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Black, no sugar or milk", "selected_answer": "Black, no sugar or milk"}, {"id": "2", "question": "What does she often eat with her coffee?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Croissant or a small sandwich", "selected_answer": "Croissant or a small sandwich"}, {"id": "3", "question": "What does she eat when she is very hungry?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Banana bread or a muffin", "selected_answer": "Banana bread or a muffin"}]}	{"accuracy": 100, "correctAnswers": 3, "totalQuestions": 3, "incorrectAnswers": 0}	0	2025-06-15 16:56:04.858	\N	\N	2025-06-15 16:56:04.859	2025-06-15 16:56:04.859	\N
1e6be36a-12d6-4f10-9443-d78a24eb7c09	b787c248-dce5-416f-b3b4-7259dcf7281c	50285181-4b29-40cb-9c9c-fde1b1491419	reading	submitted	{"text": "<p>Renewable energy comes from natural sources that are constantly replaced by the Earth. Unlike fossil fuels such as coal, oil, and natural gas, renewable energy does not run out and causes less harm to the environment. The most common renewable sources include sunlight, wind, water, and organic materials. As global energy demand increases, more countries are turning to renewable energy to reduce pollution and slow down climate change.</p><p>There are several popular types of renewable energy. Solar energy uses sunlight, which is captured by solar panels and turned into electricity. Wind energy is produced by wind turbines that spin when the wind blows. Hydropower uses the movement of rivers or dams to generate electricity. Biomass energy is made from plant and animal waste, which can be burned or turned into fuel. Geothermal energy, which comes from heat deep underground, is also used in some places. Each energy type has its strengths and is used based on the local environment and resources.</p><p>Although renewable energy is better for the planet, it still faces challenges. Solar and wind energy depend on the weather, which is not always predictable. Setting up solar panels, wind turbines, or hydropower systems can also cost a lot at first. However, the long-term savings and environmental benefits make these sources a smart choice. As technology improves and more governments support green energy, renewable power is becoming more reliable and affordable around the world.</p>", "questions": [{"id": "1", "question": "Why are renewable energy sources better than fossil fuels?", "bookmarked": false, "answer_list": [{"answer": "They are cheaper to install"}, {"answer": "They are more popular"}, {"answer": "They do not release harmful gases"}, {"answer": "They work only at night"}], "right_answer": "They do not release harmful gases"}, {"id": "2", "question": "What is one problem with renewable energy?", "bookmarked": false, "answer_list": [{"answer": "It pollutes rivers"}, {"answer": "It causes earthquakes"}, {"answer": "It needs better storage technology"}, {"answer": "t increases global warming"}], "right_answer": "It needs better storage technology"}, {"id": "3", "question": "What will happen if an employee fails to follow the policy three times in a month?", "bookmarked": false, "answer_list": [{"answer": "Ignoring it"}, {"answer": "Banning it"}, {"answer": " Investing in it"}, {"answer": "Replacing it with fossil fuels"}], "right_answer": "Investing in it"}]}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 3, "incorrectAnswers": 3}	0	2025-06-15 18:40:47.813	\N	\N	2025-06-15 18:40:47.814	2025-06-15 18:40:47.814	\N
acb4de9f-83a3-400d-bb96-6fff7564671d	9a5cb713-ae34-4985-973d-645fb5741fd8	50285181-4b29-40cb-9c9c-fde1b1491419	reading	submitted	{"text": "<p><strong>From:</strong> Anna<br><strong>To:</strong> Sarah<br><strong>Subject:</strong> My First Day at School</p><p>Hi Sarah,</p><p>I started school this week, and it was so exciting! On the first day, I woke up early and put on my new school uniform. My mom made me a yummy breakfast – eggs and toast – and then she took me to school.</p><p>When I arrived, I saw many children in the school yard. Some looked nervous, but others were happy and laughing. I met my new teacher, <strong>Ms. Lisa</strong>. She smiled and said, <em>“Welcome to class, Anna!”</em> She is very kind and friendly.</p><p>In class, we sat in a circle and introduced ourselves. I met <strong>Tom</strong> and <strong>Lily</strong>, who sit next to me. We became friends quickly. During break time, we played tag and hide-and-seek. At lunch, we ate together in the cafeteria.</p><p>In the afternoon, we had our first <strong>English</strong> lesson. Ms. Lisa taught us a fun song with actions. It was about animals, and we all sang together. I really liked it!</p><p>I can’t wait to go back tomorrow.<br>Write soon and tell me about your school!</p><p><strong>Love,</strong><br>Anna</p>", "questions": [{"id": "1", "question": "Who is Anna’s teacher?", "bookmarked": false, "answer_list": [{"answer": "Mr. John"}, {"answer": "Ms. Lisa"}, {"answer": "Mr. Peter"}, {"answer": "Ms. Linda"}], "right_answer": "Ms. Lisa"}, {"id": "2", "question": "How many new friends did Anna make?", "bookmarked": false, "answer_list": [{"answer": "One"}, {"answer": "Three"}, {"answer": "Two"}, {"answer": "Four"}], "right_answer": "Two"}, {"id": "3", "question": "What is Anna’s favorite subject?", "bookmarked": false, "answer_list": [{"answer": "Math"}, {"answer": "Science"}, {"answer": "History"}, {"answer": "English "}], "right_answer": "English"}], "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 3, "incorrectAnswers": 3}	0	2025-06-15 18:50:40.742	\N	\N	2025-06-15 18:50:40.743	2025-06-15 18:50:40.743	\N
1adccf1c-6d91-4a9d-90a6-634154f7f5d9	083b2bf6-6532-4657-b7d3-290799122ee5	50285181-4b29-40cb-9c9c-fde1b1491419	speaking	submitted	{"topic_text": "Let's practice speaking English", "prompt_text": "Let's practice speaking English", "chat_history": [{"role": "user", "text": "hi"}, {"role": "assistant", "text": "Hi!  Let's talk about environmental issues and solutions.  To start, what are some of the most serious environmental issues you're aware of, either globally or in your region?\\n"}]}	\N	10	2025-06-16 05:22:52.628	\N	\N	2025-06-15 09:57:35.07	2025-06-16 05:22:52.628	\N
cc2b3b43-57be-4ce3-81eb-e66f06e3b0c9	9a5cb713-ae34-4985-973d-645fb5741fd8	50285181-4b29-40cb-9c9c-fde1b1491419	reading	submitted	{"text": "<p><strong>From:</strong> Anna<br><strong>To:</strong> Sarah<br><strong>Subject:</strong> My First Day at School</p><p>Hi Sarah,</p><p>I started school this week, and it was so exciting! On the first day, I woke up early and put on my new school uniform. My mom made me a yummy breakfast – eggs and toast – and then she took me to school.</p><p>When I arrived, I saw many children in the school yard. Some looked nervous, but others were happy and laughing. I met my new teacher, <strong>Ms. Lisa</strong>. She smiled and said, <em>“Welcome to class, Anna!”</em> She is very kind and friendly.</p><p>In class, we sat in a circle and introduced ourselves. I met <strong>Tom</strong> and <strong>Lily</strong>, who sit next to me. We became friends quickly. During break time, we played tag and hide-and-seek. At lunch, we ate together in the cafeteria.</p><p>In the afternoon, we had our first <strong>English</strong> lesson. Ms. Lisa taught us a fun song with actions. It was about animals, and we all sang together. I really liked it!</p><p>I can’t wait to go back tomorrow.<br>Write soon and tell me about your school!</p><p><strong>Love,</strong><br>Anna</p>", "questions": [{"id": "1", "question": "Who is Anna’s teacher?", "bookmarked": false, "answer_list": [{"answer": "Mr. John"}, {"answer": "Ms. Lisa"}, {"answer": "Mr. Peter"}, {"answer": "Ms. Linda"}], "right_answer": "Ms. Lisa"}, {"id": "2", "question": "How many new friends did Anna make?", "bookmarked": false, "answer_list": [{"answer": "One"}, {"answer": "Three"}, {"answer": "Two"}, {"answer": "Four"}], "right_answer": "Two"}, {"id": "3", "question": "What is Anna’s favorite subject?", "bookmarked": false, "answer_list": [{"answer": "Math"}, {"answer": "Science"}, {"answer": "History"}, {"answer": "English "}], "right_answer": "English"}], "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 3, "incorrectAnswers": 3}	0	2025-06-15 18:52:27.437	\N	\N	2025-06-15 18:52:27.438	2025-06-15 18:52:27.438	\N
e679a79d-22ff-4904-b31a-fa5d9e7f9218	9a5cb713-ae34-4985-973d-645fb5741fd8	50285181-4b29-40cb-9c9c-fde1b1491419	reading	submitted	{"text": "<p><strong>From:</strong> Anna<br><strong>To:</strong> Sarah<br><strong>Subject:</strong> My First Day at School</p><p>Hi Sarah,</p><p>I started school this week, and it was so exciting! On the first day, I woke up early and put on my new school uniform. My mom made me a yummy breakfast – eggs and toast – and then she took me to school.</p><p>When I arrived, I saw many children in the school yard. Some looked nervous, but others were happy and laughing. I met my new teacher, <strong>Ms. Lisa</strong>. She smiled and said, <em>“Welcome to class, Anna!”</em> She is very kind and friendly.</p><p>In class, we sat in a circle and introduced ourselves. I met <strong>Tom</strong> and <strong>Lily</strong>, who sit next to me. We became friends quickly. During break time, we played tag and hide-and-seek. At lunch, we ate together in the cafeteria.</p><p>In the afternoon, we had our first <strong>English</strong> lesson. Ms. Lisa taught us a fun song with actions. It was about animals, and we all sang together. I really liked it!</p><p>I can’t wait to go back tomorrow.<br>Write soon and tell me about your school!</p><p><strong>Love,</strong><br>Anna</p>", "questions": [{"id": "1", "question": "Who is Anna’s teacher?", "bookmarked": false, "answer_list": [{"answer": "Mr. John"}, {"answer": "Ms. Lisa"}, {"answer": "Mr. Peter"}, {"answer": "Ms. Linda"}], "right_answer": "Ms. Lisa"}, {"id": "2", "question": "How many new friends did Anna make?", "bookmarked": false, "answer_list": [{"answer": "One"}, {"answer": "Three"}, {"answer": "Two"}, {"answer": "Four"}], "right_answer": "Two"}, {"id": "3", "question": "What is Anna’s favorite subject?", "bookmarked": false, "answer_list": [{"answer": "Math"}, {"answer": "Science"}, {"answer": "History"}, {"answer": "English "}], "right_answer": "English"}], "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 3, "incorrectAnswers": 3, "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	0	2025-06-15 18:53:56.464	\N	\N	2025-06-15 18:53:56.465	2025-06-15 18:53:56.465	\N
81b1208f-25a5-4102-98bc-10f5f52ba759	bdddc4ff-00c2-429b-94c3-30cc5eddd0f9	50285181-4b29-40cb-9c9c-fde1b1491419	listening	submitted	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEdvPAawg1AZEoB8z6whvLUr0MbRCXFyIa9Yct", "question_list": [{"id": "1", "question": "What is one of the biggest threats mentioned in the passage?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Pollution", "selected_answer": "War"}, {"id": "2", "question": "What does plastic pollution harm?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Marine life", "selected_answer": "Marine life "}, {"id": "3", "question": "What are some solutions mentioned?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Reducing waste and using public transport", "selected_answer": "Using private cars more"}]}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 3, "incorrectAnswers": 3}	0	2025-06-15 19:00:01.558	\N	\N	2025-06-15 19:00:01.559	2025-06-15 19:00:01.559	\N
a61e268d-366f-4808-b788-26a2107cb68c	bdddc4ff-00c2-429b-94c3-30cc5eddd0f9	50285181-4b29-40cb-9c9c-fde1b1491419	listening	submitted	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEdvPAawg1AZEoB8z6whvLUr0MbRCXFyIa9Yct", "question_list": [{"id": "1", "question": "What is one of the biggest threats mentioned in the passage?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Pollution", "selected_answer": "Unemployment"}, {"id": "2", "question": "What does plastic pollution harm?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Marine life", "selected_answer": "Animals in forests"}, {"id": "3", "question": "What are some solutions mentioned?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Reducing waste and using public transport", "selected_answer": "Reducing waste and using public transport"}]}	{"accuracy": 33.33, "correctAnswers": 1, "totalQuestions": 3, "incorrectAnswers": 2}	0	2025-06-16 03:35:48.402	\N	\N	2025-06-16 03:35:48.403	2025-06-16 03:35:48.403	\N
ba85b1f2-c2b4-4e17-a910-deffa90cd229	bdddc4ff-00c2-429b-94c3-30cc5eddd0f9	50285181-4b29-40cb-9c9c-fde1b1491419	listening	submitted	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEdvPAawg1AZEoB8z6whvLUr0MbRCXFyIa9Yct", "question_list": [{"id": "1", "question": "What is one of the biggest threats mentioned in the passage?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Pollution", "selected_answer": "War"}, {"id": "2", "question": "What does plastic pollution harm?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Marine life", "selected_answer": "Animals in forests"}, {"id": "3", "question": "What are some solutions mentioned?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Reducing waste and using public transport", "selected_answer": "Using private cars more"}], "youtube_embed_url": "https://www.youtube.com/embed/58i-0Kul26I"}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 3, "incorrectAnswers": 3, "youtube_embed_url": "https://www.youtube.com/embed/58i-0Kul26I"}	0	2025-06-16 03:39:52.69	\N	\N	2025-06-16 03:39:52.692	2025-06-16 03:39:52.692	\N
1059222f-01a6-4735-8631-af050fdcd67c	b787c248-dce5-416f-b3b4-7259dcf7281c	50285181-4b29-40cb-9c9c-fde1b1491419	reading	submitted	{"text": "<p>Renewable energy comes from natural sources that are constantly replaced by the Earth. Unlike fossil fuels such as coal, oil, and natural gas, renewable energy does not run out and causes less harm to the environment. The most common renewable sources include sunlight, wind, water, and organic materials. As global energy demand increases, more countries are turning to renewable energy to reduce pollution and slow down climate change.</p><p>There are several popular types of renewable energy. Solar energy uses sunlight, which is captured by solar panels and turned into electricity. Wind energy is produced by wind turbines that spin when the wind blows. Hydropower uses the movement of rivers or dams to generate electricity. Biomass energy is made from plant and animal waste, which can be burned or turned into fuel. Geothermal energy, which comes from heat deep underground, is also used in some places. Each energy type has its strengths and is used based on the local environment and resources.</p><p>Although renewable energy is better for the planet, it still faces challenges. Solar and wind energy depend on the weather, which is not always predictable. Setting up solar panels, wind turbines, or hydropower systems can also cost a lot at first. However, the long-term savings and environmental benefits make these sources a smart choice. As technology improves and more governments support green energy, renewable power is becoming more reliable and affordable around the world.</p>", "questions": [{"id": "1", "question": "Why are renewable energy sources better than fossil fuels?", "bookmarked": false, "answer_list": [{"answer": "They are cheaper to install"}, {"answer": "They are more popular"}, {"answer": "They do not release harmful gases"}, {"answer": "They work only at night"}], "right_answer": "They do not release harmful gases", "selected_answer": "They are more popular"}, {"id": "2", "question": "What is one problem with renewable energy?", "bookmarked": false, "answer_list": [{"answer": "It pollutes rivers"}, {"answer": "It causes earthquakes"}, {"answer": "It needs better storage technology"}, {"answer": "t increases global warming"}], "right_answer": "It needs better storage technology", "selected_answer": "It needs better storage technology"}, {"id": "3", "question": "What will happen if an employee fails to follow the policy three times in a month?", "bookmarked": false, "answer_list": [{"answer": "Ignoring it"}, {"answer": "Banning it"}, {"answer": " Investing in it"}, {"answer": "Replacing it with fossil fuels"}], "right_answer": "Investing in it", "selected_answer": " Investing in it"}], "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	{"accuracy": 33.33, "correctAnswers": 1, "totalQuestions": 3, "incorrectAnswers": 2, "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	0	2025-06-16 03:53:52.769	\N	\N	2025-06-16 03:53:52.77	2025-06-16 03:53:52.77	\N
218ea8cd-e147-48f8-a163-575251d12f28	b365942d-b625-4bfd-8f2e-394dcfc5fb48	50285181-4b29-40cb-9c9c-fde1b1491419	speaking	draft	{"prompt": "Let's practice speaking English\\n\\nTopic: \\"Travel and Tourism\\"\\n\\nAsk follow-up questions like:\\n- What places have you visited?\\n- How was your last trip?\\n- Do you prefer traveling alone or with friends?\\n- What country would you like to visit next and why?\\n\\nBackground knowledge to consider: Focus on travel experiences, cultural differences, and common travel vocabulary such as 'hotel', 'sightseeing', 'itinerary', 'passport'.", "messages": [{"role": "user", "content": "I've been to Mexico and Canada."}, {"role": "assistant", "content": "That's great!  Mexico and Canada offer very different travel experiences.  \\n\\nWhat places in Mexico did you visit, and what was your favorite part of that trip?  And what about Canada – what region did you explore there, and what were some highlights?\\n"}]}	\N	10	\N	\N	\N	2025-06-16 05:23:03.565	2025-06-16 05:23:10.685	\N
ba1969c5-06a5-4ce3-a7b0-3407951fb729	083b2bf6-6532-4657-b7d3-290799122ee5	50285181-4b29-40cb-9c9c-fde1b1491419	speaking	submitted	{"topic_text": "Let's practice speaking English", "prompt_text": "Let's practice speaking English", "chat_history": [{"role": "user", "text": "Hi"}, {"role": "assistant", "text": "Hi!  Let's talk about environmental issues and solutions.  To start, what are some of the most pressing environmental issues you're aware of, either globally or specifically in your region?\\n"}, {"role": "user", "text": "Air polution i think"}, {"role": "assistant", "text": "Air pollution is definitely a significant issue.  That's a great starting point.  What are the main causes of air pollution where you live, and what are some of the effects you've noticed or heard about as a result of this pollution?\\n"}, {"role": "user", "text": "Well, in my city, a lot of it comes from traffic and industrial emissions.  I often see hazy skies, and I've heard that respiratory illnesses are quite common because of it"}, {"role": "assistant", "text": "That's understandable.  Hazy skies and increased respiratory illnesses are serious consequences.  So, traffic and industrial emissions are the main culprits.  What measures, do you think, should be implemented to reduce these emissions?  And what role do you think individuals can play in mitigating air pollution caused by traffic?\\n"}, {"role": "user", "text": "I think we should invest in public transportation and promote cycling.  Individuals could use their cars less, carpool, or switch to electric vehicles"}, {"role": "assistant", "text": "Those are excellent suggestions! Investing in public transport and promoting cycling are definitely steps towards reducing traffic-related emissions.  Carpooling and electric vehicles are also great individual actions.  But how can the government incentivize these changes?  What policies or initiatives do you think would be most effective in encouraging people to adopt these more sustainable practices?  For example, should there be stricter emission standards for vehicles or tax incentives for electric cars?\\n"}, {"role": "user", "text": "Nice"}, {"role": "assistant", "text": "\\"Nice\\" is a bit vague.  To continue our conversation productively, could you elaborate on what you found \\"nice\\"?  Did you mean you like the suggestions?  Or were you agreeing with the question about government incentives?  Let's delve deeper into those government policies. What specific incentives do you think would be most effective in encouraging people to use public transportation, cycle more, or switch to electric vehicles?  Perhaps tax breaks, subsidies, or improved infrastructure?\\n"}]}	\N	10	2025-06-16 05:22:44.862	\N	\N	2025-06-16 04:58:51.457	2025-06-16 05:22:44.863	\N
47924493-75ce-4050-9a96-9f3b85af70df	86e747e3-3f19-40cb-a93d-55ad77bf4122	50285181-4b29-40cb-9c9c-fde1b1491419	writing	scored	{"lesson_id": "86e747e3-3f19-40cb-a93d-55ad77bf4122", "user_data": {"body1": "<p>The main negative effect of workaholism is poor health and personal life. People who spend too much time working often do not get enough rest or sleep. This can lead to stress, burnout, and even serious health problems. In addition, they may not have enough time for family, friends, or hobbies, which can hurt their relationships and overall happiness.</p>", "body2": "<p>On the other hand, workaholism can lead to success and personal growth. People who are very focused on their jobs often achieve more in their careers. They may get promoted faster, earn higher salaries, and gain more respect from others. Also, working hard can help them learn new skills, become more disciplined, and build a strong work ethic, which are useful in many areas of life.</p>", "conclusion": "<p>In conclusion, workaholism has both positive and negative sides. While it can harm health and relationships, it can also bring career success and personal development. If a person can manage their time and take care of themselves, the positive effects of hard work can be enjoyed without suffering from the downsides.</p>", "instruction": "<p>Some people believe that being a workaholic is harmful, while others think it can have some positive effects. In my opinion, although working too much can be unhealthy, there are certain benefits that come with being highly dedicated to work</p>"}, "chat_history": []}	{"grammar": 6, "corrections": [{"id": "b7d482b3-d31e-4c2e-a567-914481f65f52", "error": "grammar", "reason": "Instead of believe that being a workaholic is harmful I suggest believe that being a workaholic is harmful", "position": "12", "sentence": "believe that being a workaholic is harmful", "suggestion": "believe that being a workaholic is harmful"}, {"id": "6dd75c62-e262-4b33-bc22-ae4e5db64364", "error": "grammar", "reason": "Instead of  health and personal I suggest  health and personal", "position": "47", "sentence": " health and personal", "suggestion": " health and personal"}, {"id": "b65120fb-6e58-40ad-9b65-f340fe2b1a9a", "error": "grammar", "reason": "Instead of success and personal growth I suggest success and personal growth", "position": "43", "sentence": "success and personal growth", "suggestion": "success and personal growth"}, {"id": "8fbe7c1e-5a88-448d-b589-99779fcf5a40", "error": "grammar", "reason": "Instead of both positive and negative  I suggest both positive and negative ", "position": "31", "sentence": "both positive and negative ", "suggestion": "both positive and negative "}], "overall_score": 3, "task_response": 6, "lexical_resource": 7, "overall_feedback": "<p>Bài viết có cấu trúc rõ ràng, có điểm mạnh và điểm yếu. Tuy nhiên, cần cải thiện độ trong sáng và cấu trúc của bài viết.</p>", "coherence_cohesion": 8}	0	2025-06-17 13:43:49.515	2025-06-17 14:03:14.886	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-17 13:43:49.516	2025-06-17 14:03:14.887	\N
b0da80ea-6b02-48d7-892a-afba7aaf695e	b787c248-dce5-416f-b3b4-7259dcf7281c	c817735c-513c-4453-9e6e-9e9d7f25ab4c	reading	submitted	{"text": "<p>Renewable energy comes from natural sources that are constantly replaced by the Earth. Unlike fossil fuels such as coal, oil, and natural gas, renewable energy does not run out and causes less harm to the environment. The most common renewable sources include sunlight, wind, water, and organic materials. As global energy demand increases, more countries are turning to renewable energy to reduce pollution and slow down climate change.</p><p>There are several popular types of renewable energy. Solar energy uses sunlight, which is captured by solar panels and turned into electricity. Wind energy is produced by wind turbines that spin when the wind blows. Hydropower uses the movement of rivers or dams to generate electricity. Biomass energy is made from plant and animal waste, which can be burned or turned into fuel. Geothermal energy, which comes from heat deep underground, is also used in some places. Each energy type has its strengths and is used based on the local environment and resources.</p><p>Although renewable energy is better for the planet, it still faces challenges. Solar and wind energy depend on the weather, which is not always predictable. Setting up solar panels, wind turbines, or hydropower systems can also cost a lot at first. However, the long-term savings and environmental benefits make these sources a smart choice. As technology improves and more governments support green energy, renewable power is becoming more reliable and affordable around the world.</p>", "questions": [{"id": "1", "question": "Why are renewable energy sources better than fossil fuels?", "bookmarked": false, "answer_list": [{"answer": "They are cheaper to install"}, {"answer": "They are more popular"}, {"answer": "They do not release harmful gases"}, {"answer": "They work only at night"}], "right_answer": "They do not release harmful gases", "selected_answer": "They are more popular"}, {"id": "2", "question": "What is one problem with renewable energy?", "bookmarked": false, "answer_list": [{"answer": "It pollutes rivers"}, {"answer": "It causes earthquakes"}, {"answer": "It needs better storage technology"}, {"answer": "t increases global warming"}], "right_answer": "It needs better storage technology", "selected_answer": "It needs better storage technology"}, {"id": "3", "question": "What will happen if an employee fails to follow the policy three times in a month?", "bookmarked": false, "answer_list": [{"answer": "Ignoring it"}, {"answer": "Banning it"}, {"answer": " Investing in it"}, {"answer": "Replacing it with fossil fuels"}], "right_answer": "Investing in it", "selected_answer": "Banning it"}], "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	{"accuracy": 33.33, "correctAnswers": 1, "totalQuestions": 3, "incorrectAnswers": 2, "youtube_embed_url": "https://www.youtube.com/embed/1zGs-CgmYCo"}	0	2025-06-16 09:59:14.395	\N	\N	2025-06-16 09:59:14.398	2025-06-16 09:59:14.398	\N
47695176-7f8b-4b67-97e3-6fd45d2a7271	bdddc4ff-00c2-429b-94c3-30cc5eddd0f9	c817735c-513c-4453-9e6e-9e9d7f25ab4c	listening	submitted	{"audio_url": "https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEdvPAawg1AZEoB8z6whvLUr0MbRCXFyIa9Yct", "question_list": [{"id": "1", "question": "What is one of the biggest threats mentioned in the passage?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Pollution", "selected_answer": "War"}, {"id": "2", "question": "What does plastic pollution harm?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Marine life", "selected_answer": "Animals in forests"}, {"id": "3", "question": "What are some solutions mentioned?", "bookmarked": false, "answer_list": [[], [], [], []], "right_answer": "Reducing waste and using public transport", "selected_answer": "Building more factories"}], "youtube_embed_url": "https://www.youtube.com/embed/58i-0Kul26I"}	{"accuracy": 0, "correctAnswers": 0, "totalQuestions": 3, "incorrectAnswers": 3, "youtube_embed_url": "https://www.youtube.com/embed/58i-0Kul26I"}	0	2025-06-16 09:59:53.576	\N	\N	2025-06-16 09:59:53.579	2025-06-16 09:59:53.579	\N
ca6ecccd-cfdc-46e0-8bd2-1526b34f6042	3c51bbc1-a1ee-4fa8-acc9-8bb331f70835	50285181-4b29-40cb-9c9c-fde1b1491419	speaking	submitted	{"topic_text": "This topic focuses on everyday activities such as waking up, going to school or work, having meals, and relaxing. It helps students become comfortable with using the present simple tense and basic daily vocabulary.", "prompt_text": "This topic focuses on everyday activities such as waking up, going to school or work, having meals, and relaxing. It helps students become comfortable with using the present simple tense and basic daily vocabulary.", "chat_history": [{"role": "user", "text": "I usually wake up at 7 am and go to bed around 11 pm."}, {"role": "assistant", "text": "That's a pretty regular sleep schedule!  \\n\\nFollow-up questions:\\n\\n* **What do you do immediately after you wake up?** (This helps elicit more details about their routine and practice present simple.)\\n* **How long does it usually take you to get ready in the morning?** (Focuses on time expressions and sequencing of actions.)\\n* **Do you always wake up at 7 am, or does it sometimes vary?** (Explores the use of \\"always\\" and \\"sometimes\\".)\\n* **Do you have a particular alarm sound or method that helps you wake up?** (Opens up conversation and allows for more natural language use.)\\n* **What time do you usually have dinner?** (Expands the conversation to other parts of the day.)\\n"}, {"role": "user", "text": "I usually make my bed and then have breakfast."}, {"role": "assistant", "text": "Great!  That's a good start to the day.\\n\\nFollow-up questions:\\n\\n* **What do you usually have for breakfast?** (Focuses on food vocabulary and present simple.)\\n* **How long does it take you to eat breakfast?** (Time expressions and duration)\\n* **Do you always make your bed, or do you sometimes skip it?** (Using adverbs of frequency)\\n* **What kind of breakfast do you prefer?** (More open-ended, allowing for more natural language)\\n* **After breakfast, what do you do next?** (Continuing to build the sequence of their daily routine)\\n"}, {"role": "user", "text": "I usually have cereal with milk."}, {"role": "assistant", "text": "Okay, cereal and milk!  A classic breakfast.\\n\\nFollow-up questions:\\n\\n* **What kind of cereal do you usually eat?** (Specific vocabulary related to food)\\n* **Do you ever have anything else with your cereal, like fruit or yogurt?** (Expanding on the breakfast description)\\n* **Is cereal your favorite breakfast food?  If not, what is?** (Opinion and preference, using comparative structures if appropriate)\\n* **Do you prepare your cereal yourself, or does someone else make it for you?** (Adding detail and using different sentence structures)\\n* **After you finish your cereal, what's the next thing you do before leaving for school/work?** (Keeps the focus on the daily routine sequence)\\n"}, {"role": "user", "text": "I usually eat cornflakes."}, {"role": "assistant", "text": "Cornflakes!  A simple and common choice.\\n\\nHere are some follow-up questions:\\n\\n* **Do you add sugar to your cornflakes?** (Details about preparation)\\n* **How many bowls of cornflakes do you usually eat?** (Quantifiers and numbers)\\n* **Do you prefer your milk cold or warm?** (Details about preference)\\n* **Is there any other type of cereal you sometimes eat instead of cornflakes?** (Variety and alternatives, using \\"sometimes\\")\\n* **What time do you usually finish eating breakfast?** (Connecting to time and the overall routine)\\n"}, {"role": "user", "text": "I usually add a little sugar."}, {"role": "assistant", "text": "Okay, a little sugar.  \\n\\nHere are some follow up questions:\\n\\n* **Do you prefer milk or yogurt with your cornflakes?** (Comparing preferences)\\n* **How much sugar do you usually add?  (A spoonful? A packet?)** (More specific details and quantifiers)\\n* **What do you do after you finish your breakfast?** (Continuing the sequence of the daily routine)\\n* **Do you ever eat cornflakes for any other meal besides breakfast?** (Exploring unusual scenarios and expanding the context)\\n* **If you didn't have cornflakes, what would you eat for breakfast instead?** (Exploring alternatives and hypothetical situations)\\n"}, {"id": "1750052361211", "role": "user", "text": "I prefer milk.", "timestamp": "2025-06-16T05:39:21.211Z"}, {"id": "1750052368050", "role": "bot", "text": "Good to know you prefer milk with your cornflakes.  Here are some follow-up questions:* **Do you always have milk with your cornflakes, or do you sometimes have it with something else?** (Exploring variations in routine)* **What kind of milk do you use? (Whole milk, skim milk, almond milk, etc.)** (Expanding vocabulary related to milk types)* **What do you do after you finish your breakfast?  Do you brush your teeth, get dressed, or something else?** (Continuing to build the sequence of the daily routine)* **What time do you usually finish eating breakfast?** (Focusing on time management within the routine)* **Do you ever eat breakfast out?  If so, what do you usually order?** (Exploring different breakfast settings)", "timestamp": "2025-06-16T05:39:28.050Z"}]}	\N	10	2025-06-16 05:42:09.197	\N	\N	2025-06-16 05:28:21.829	2025-06-16 05:42:09.198	\N
ff61e635-8d80-4869-8cee-e5ebbfd2fb89	86e747e3-3f19-40cb-a93d-55ad77bf4122	c817735c-513c-4453-9e6e-9e9d7f25ab4c	writing	scored	{"lesson_id": "86e747e3-3f19-40cb-a93d-55ad77bf4122", "user_data": {"body1": "<p>The first benefit is better job opportunities. In some places, there are not many good jobs. By moving to a bigger city or another country, people can find jobs that match their skills and offer higher salaries. This helps them have a better future and reach their goals faster.</p><p></p>", "body2": "<p>The second benefit is personal growth. When people live in a new place, they learn many new things. They meet different people, learn how to live on their own, and solve problems by themselves. This makes them stronger, more confident, and more open-minded.</p>", "conclusion": "<p>In conclusion, even though moving for work can be hard at the beginning, I think it is a good decision. It gives people better job chances and helps them grow in life. That’s why I believe relocating for work has more benefits than challenges.</p>", "instruction": "<p>Nowadays, many people move to different places because of work. Some think it is difficult and stressful, but I believe relocating for a job brings more good things than problems. It can help people improve their careers and grow as a person.</p><p></p>"}, "chat_history": []}	{"grammar": 6, "corrections": [{"id": "d796dff1-741f-49a8-8d0a-0000599f529b", "error": "cohesion", "reason": "The text is grammatically incorrect", "position": "8", "sentence": "t benefit is better job opportunities.", "suggestion": "The correct version of the text"}, {"id": "21b21e69-3a5b-4fc1-9874-8dad2bd01615", "error": "grammar", "reason": "The text is grammatically incorrect", "position": "208", "sentence": "each their goals faste", "suggestion": "The correct version of the text"}, {"id": "43f6ef39-bdfa-46a2-94da-4100d9ff3a85", "error": "grammar", "reason": "The text is grammatically incorrect", "position": "10", "sentence": "many people ", "suggestion": "much people"}], "overall_score": 4, "task_response": 6, "lexical_resource": 7, "overall_feedback": "<p>Bài viết có cấu trúc rõ ràng, có điểm mạnh và điểm yếu. Tuy nhiên, cần cải thiện độ trong sáng và cấu trúc của bài viết.</p>", "coherence_cohesion": 6}	0	2025-06-16 09:56:58.619	2025-06-16 10:21:33.858	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-16 09:56:58.621	2025-06-16 10:21:33.86	\N
1abf09b6-8f12-4a63-9804-ea42763f5915	3c51bbc1-a1ee-4fa8-acc9-8bb331f70835	c817735c-513c-4453-9e6e-9e9d7f25ab4c	speaking	submitted	{"topic_text": "This topic focuses on everyday activities such as waking up, going to school or work, having meals, and relaxing. It helps students become comfortable with using the present simple tense and basic daily vocabulary.", "prompt_text": "This topic focuses on everyday activities such as waking up, going to school or work, having meals, and relaxing. It helps students become comfortable with using the present simple tense and basic daily vocabulary.", "chat_history": [{"role": "user", "text": "Hello."}, {"role": "assistant", "text": "Hello!  Let's talk about your daily routine.  First, what time do you usually wake up and go to bed?\\n"}, {"role": "user", "text": "I usually wake up at 7:00 am and go to bed around 11:00 pm."}, {"role": "assistant", "text": "That's a pretty consistent schedule!  What is your favorite part of the day? Why?\\n"}]}	\N	10	2025-06-16 09:58:51.325	\N	\N	2025-06-16 09:57:29.148	2025-06-16 09:58:51.326	\N
9fae6136-fe8f-4a6d-8707-aba4e48d78b4	86e747e3-3f19-40cb-a93d-55ad77bf4122	c817735c-513c-4453-9e6e-9e9d7f25ab4c	writing	scored	{"lesson_id": "86e747e3-3f19-40cb-a93d-55ad77bf4122", "user_data": {"body1": "<p>There are some drawbacks when people move for better job opportunities.</p>", "body2": "<p>However, the benefits, especially in career prospects and personal growth, outweigh the negatives.</p>", "conclusion": "<p>Although relocating may cause issues, the personal and professional gains are far more significant.</p>", "instruction": "<p>Relocating for work is common and offers more benefits than challenges.</p>"}, "chat_history": []}	{"grammar": 6, "corrections": [{"id": "f9c59d8d-fcfe-4d31-a10e-63fc8db8e43f", "error": "grammar", "reason": "The text is grammatically incorrect", "position": "0", "sentence": "Selection Mode On\\nRelocating for work is common and offers more benefits", "suggestion": "The correct version of the text"}], "overall_score": 7, "task_response": 6, "lexical_resource": 7, "overall_feedback": "<p>Bài viết có cấu trúc rõ ràng, có điểm mạnh và điểm yếu. Tuy nhiên, cần cải thiện độ trong sáng và cấu trúc của bài viết.</p>", "coherence_cohesion": 8}	0	2025-06-16 10:24:19.899	2025-06-16 10:24:47.2	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-16 10:24:19.9	2025-06-16 10:24:47.201	\N
f1ed59f4-34a1-415a-aacd-9f9ae403bcaa	ec721b8c-4cbe-439d-b789-5c65e19f5e7f	848b7f6b-85f2-44eb-933e-d3a798072003	writing	scored	{"lesson_id": "ec721b8c-4cbe-439d-b789-5c65e19f5e7f", "user_data": {"body1": "<p>There are some drawbacks when people move for better job opportunities.</p>", "body2": "<p>However, the benefits, especially in career prospects and personal growth, outweigh the negatives.</p>", "conclusion": "<p>Although relocating may cause issues, the personal and professional gains are far more significant.</p>", "instruction": "<p>Relocating for work is common and offers more benefits than challenges.</p>"}, "chat_history": []}	{"grammar": 6, "corrections": [{"id": "4e2ac422-5baa-4512-a124-b07dc53bc732", "error": "grammar", "reason": "The text is grammatically incorrect", "position": "33", "sentence": " offers more benefits than challenges.", "suggestion": "The correct version of the text"}], "overall_score": 7, "task_response": 6, "lexical_resource": 7, "overall_feedback": "<p>Bài viết có cấu trúc rõ ràng, có điểm mạnh và điểm yếu. Tuy nhiên, cần cải thiện độ trong sáng và cấu trúc của bài viết.</p>", "coherence_cohesion": 8}	0	2025-06-17 17:31:00.314	2025-06-17 17:31:55.342	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-17 17:31:00.317	2025-06-17 17:31:55.344	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."User" (id, username, email, password_hash, role, auth_provider, auth_provider_id, first_name, last_name, profile_picture, is_email_verified, last_login, created_at, updated_at, deleted_at, bio) FROM stdin;
a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	nguyenvana	nguyenvana@gmail.com	$2b$10$RFR9XQSCmCx6F4n4ncMYkOPVyZBCJxlLofnUIflEyyuEbYwaKXU2q	user	local	\N	Nguyen	Van A	\N	f	2025-06-16 09:45:07.421	2025-05-23 04:42:53.3	2025-06-16 09:45:07.423	\N	
56bb530c-d276-4b58-9d2b-bf3b15d034d8	test_user	test@gmail.com	$2b$10$11zWAeJIiwBV7rI.TYlF4.nW/kLj67MvHs5j8BFcMeG9XgHXx8pci	user	local	\N	Student	One	https://example.com/student1.jpg	t	2025-06-13 07:47:43.695	2025-05-22 14:45:56.509	2025-06-13 07:47:43.697	\N	Student bio
a8f0b7c1-c43c-4148-a2d5-b44e0e1dc081	nguyenvana1	nguyenvana1@gmail.com	$2b$10$N671p1U763YFH8HraJ.gxuQ1RsYKdms5eXKlK9X7h4M45FNmicCUS	user	local	\N	Nguyen	Van A	\N	f	2025-06-12 18:45:27.779	2025-06-12 18:45:26.652	2025-06-12 18:45:27.78	\N	
e3b98802-a44d-4200-ab70-c4c2bcd3d09a	test	test123@gmail.com	$2b$10$GmgnOQJ/EgPzSmGjRaf9eekWVCfAzRNdDlUYMiH7.TwkMaKuqv842	user	local	\N	Nguyen	Van A	\N	f	2025-06-06 15:08:48.137	2025-06-06 14:13:06.773	2025-06-06 15:08:48.138	\N	
84349163-ffca-4ca5-b4c0-82686ce16e7a	Nguyen Bui Minh Nhat	20161347@student.hcmute.edu.vn		user	google	\N	Nguyen Bui Minh	Nhat	https://lh3.googleusercontent.com/a/ACg8ocIB3JXVVfujreWt9r2xaUdjKc0NbKDjYqg5yXlXSAQJXlB00A=s96-c	t	2025-05-25 07:53:04.573	2025-05-24 06:33:09.112	2025-05-25 07:53:04.574	\N	\N
48ddaeaf-1afe-4b0d-aa60-dd4a3188467e	teacher_two	teacher_two@gmail.com	$2b$10$9t/mwSkPuMs9LEyt7qtK6.n0FLqC9qA21VMigIqd1v6Rd40JEwmzu	teacher	local	\N	Teacher	Two	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeG3neC0ZxPRBRBQ2y2dHnkIujON02lC6sZg&s	t	2025-05-22 15:31:57.835	2025-05-22 15:08:34.246	2025-05-22 15:31:57.836	\N	This is a test bio
b85eac34-9f98-4f7d-9575-973e55e057bc	ng2	a@gmail.com	$2b$10$jdxUbNl8UeG6khxWcgW/aOxyG34.c6ndtWp0Gts3GeDkk9wVQwF/e	user	local	\N	Nguyen	Van A	\N	f	2025-06-09 10:03:36.336	2025-06-09 09:47:10.068	2025-06-09 10:03:36.349	\N	
e092ff43-54a2-4b16-986f-b0474630bc34	Tín Nguyễn	tinvannguyen2001@gmail.com		user	google	\N	Tín	Nguyễn	https://lh3.googleusercontent.com/a/ACg8ocJkgxq5xNklEeU1AxuuYgr0kW37axmISYxYKjTMClv6hYFwlA=s96-c	t	2025-06-06 18:12:07.489	2025-06-06 07:36:08.035	2025-06-06 18:12:07.49	\N	\N
1f3aa11e-6d15-44e3-857f-d3ff28f348fd	2 gpt	tknhatgpt2@gmail.com		user	google	\N	2	gpt	https://lh3.googleusercontent.com/a/ACg8ocLa_vdzMV8NehDMQg8BXmOFTw8-Qx27zuQixUM04z0tacFL2g=s96-c	t	2025-06-15 16:56:07.523	2025-06-12 15:36:18.024	2025-06-15 16:56:07.525	\N	\N
a3848bfb-aeac-4938-a9d0-7484c1da70d9	admin	admin@gmail.com	$2b$10$11zWAeJIiwBV7rI.TYlF4.nW/kLj67MvHs5j8BFcMeG9XgHXx8pci	admin	local	\N	Admin	One	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE9wCvTRpcwXK0du8iZ9AjfxO357PlNTs4FvJG	t	2025-06-17 18:09:31.805	2025-05-22 14:45:56.608	2025-06-17 18:09:31.806	\N	Admin bio
50285181-4b29-40cb-9c9c-fde1b1491419	Minh Nhật Nguyễn	nhat1234559@gmail.com	$2b$10$QOz9mTtsv7SmyKETntuMZ.87mvW8n9zDyteJGnD2PCAGSKBUpbF/a	user	google	\N	Minh Nhật	Nguyễn	https://lh3.googleusercontent.com/a/ACg8ocKUVMge-piFhb8vLReOyn2KHsiRv5EU2hurWqM4eIJajYpyloWg=s96-c	t	2025-06-17 17:48:58.91	2025-05-23 13:55:54.95	2025-06-17 18:17:37.308	\N	\N
84720616-0d0e-415b-aba0-1eb465e9fb93	nguyn	ngu@gmail.com	$2b$10$CZi7Agf0d7AQzusphEwnHOVhEzOzaFsM3DFGtRmz.nKnzjs8JmAGi	user	local	\N	Nguyen	Van A	\N	f	2025-06-15 15:58:59.62	2025-06-15 15:53:29.379	2025-06-15 15:58:59.621	\N	
c817735c-513c-4453-9e6e-9e9d7f25ab4c	Diệu Đặng Huy	danghuydieu1243@gmail.com		user	google	\N	Diệu	Đặng Huy	https://lh3.googleusercontent.com/a/ACg8ocJ9rXesxz4M2dUFfJRUk6Yb46z7cPx614hsGVx1F_x71iGY2s1F=s96-c	t	2025-06-16 10:50:56.068	2025-06-16 09:48:10.653	2025-06-16 10:50:56.069	\N	\N
a001fa67-2813-41a2-af2a-423d3c743198	minhanh	teacher@gmail.com	$2b$10$11zWAeJIiwBV7rI.TYlF4.nW/kLj67MvHs5j8BFcMeG9XgHXx8pci	teacher	local	\N	Nguyễn Thị	Minh Anh	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE6UPfVRa9HvtmCzUZoWN10p2qhedE87yuTDxX	t	2025-06-17 17:33:49.111	2025-05-22 14:45:56.579	2025-06-17 17:33:49.112	\N	Giáo viên tiếng Anh giàu kinh nghiệm với niềm đam mê giúp học sinh đạt được mục tiêu học ngôn ngữ của mình.
275a813b-b2e3-42d3-8e77-149c3243a88c	Liễu Bùi Thị	buithilieu02071972@gmail.com		user	google	\N	Liễu	Bùi Thị	https://lh3.googleusercontent.com/a/ACg8ocJh36tTFC7RsPNxVCgRh_-PuaV_lYnHuphuOWMY3HKJP7B27A=s96-c	t	2025-06-17 17:27:29.048	2025-06-17 16:15:10.373	2025-06-17 17:27:29.051	\N	\N
848b7f6b-85f2-44eb-933e-d3a798072003	nathan nguyen	nathannguyen1234559@gmail.com		user	google	\N	nathan	nguyen	https://lh3.googleusercontent.com/a/ACg8ocK_k1sQ3V-wadJA0IzIsiOh7gKZtLmkY4HbkkivWSAUlNufjA=s96-c	t	2025-06-17 17:32:00.08	2025-06-17 17:28:48.835	2025-06-17 17:32:00.081	\N	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
937e67d5-faa4-4d80-81f0-50ea63b51d32	97e4ef51b450dd8574ea357e7b1b25694b5ab6e9a93cc5b805afe60316bdcf49	2025-05-22 14:34:38.514308+00	20250217133836_init	\N	\N	2025-05-22 14:34:38.245581+00	1
b99db8a4-c896-44d2-b8f0-96596d6e48eb	3088feabdf85249b2e2e9b65e739095ad13796d73fd9d4c9a9e4ba18fbf300d9	2025-05-22 14:34:38.768015+00	20250227035542_add_thumbnail_to_lesson	\N	\N	2025-05-22 14:34:38.576334+00	1
5581f6fb-4f33-4187-a3a0-969601754aeb	c890cf43877b5e2448e3c00d75d141a9c5fa7dfbf93dae02afac8a4243f4f484	2025-06-15 15:32:39.347224+00	20250615153239_add_bankingqr_image_url	\N	\N	2025-06-15 15:32:39.202476+00	1
6e774010-7258-4ecd-ad5c-7ab87f3a337d	c3bb95640aecbc186e187f9700a452d6fa3a0d8da67905aa1283cf29b1e32042	2025-05-22 14:34:39.022692+00	20250304034137_add_tags_to_lesson	\N	\N	2025-05-22 14:34:38.826999+00	1
03b9dad2-d31a-4d38-b327-90f39c7f670e	01aeae8892ea1b87c6ac03b466d41f388ff0533320d5284aa63299af29ab4fe6	2025-05-22 14:34:39.283482+00	20250427060816_comment_system	\N	\N	2025-05-22 14:34:39.103722+00	1
5fd5db95-9d16-49b2-9f61-fc8de824e394	32d1bd4b7f97d83dd0cc3c51d155beadc7b3b5ea57bd9531c1316bbbaacfe411	2025-05-22 14:34:39.569907+00	20250427064741_activity_steak	\N	\N	2025-05-22 14:34:39.367405+00	1
b3f0937b-86de-40ca-8081-f0ce22513199	45085f2181180c03837504a4068f0b425c5bcbb91a73353493e560eacb72690e	2025-06-16 04:00:55.950153+00	20250616040055_add_action_link_comment	\N	\N	2025-06-16 04:00:55.805147+00	1
e9d688db-4a26-45c0-a937-110cc023a7e6	ad396ffb78ea2ce7932dea3d4cfb71a11f43f42f7532f2b84fbd4175d1a6f492	2025-05-22 14:34:39.823237+00	20250427065634_update_identifer_comment	\N	\N	2025-05-22 14:34:39.653976+00	1
32ebc727-8814-4f85-986d-ce9ac05f4076	b54c6819b166bfcd93051ef08e8734da7278ef27c3f1df74c818570553641d06	2025-05-22 14:34:40.096969+00	20250504182652_token_transaction	\N	\N	2025-05-22 14:34:39.905696+00	1
c05d6bf3-d6b9-4f30-ac89-c8452fc84f1e	f1c935053a5bb6dca8e00067afbc191b5daa3529ab5d590bce2660e49bac8bc4	2025-05-22 14:34:40.375637+00	20250505025629_change_to_use_code_for_package	\N	\N	2025-05-22 14:34:40.180774+00	1
5fbfdde9-3031-4b75-a138-24a82cb0039f	e3e7bba08283f59a31d43c77d4c25638e53ef5b5896fa092d59360cfa4d791f5	2025-05-22 14:34:40.629493+00	20250505032528_add_internal_enum	\N	\N	2025-05-22 14:34:40.433753+00	1
2c9ae9d7-d811-40f5-8ec7-3811dd151d6d	eb47594c0c50fac7b52a754ca53efcdbbc867c278fa055c7a30ee7aa70c81850	2025-05-22 14:34:40.905376+00	20250505044434_remove_tokens_balance_from_student_profile	\N	\N	2025-05-22 14:34:40.687547+00	1
a223ef72-5d5a-444e-92cd-6399aab40eed	4beaa1335079a37b30feab1bbabc3a4c0f51276f2d180c0abe23173a5ea23269	2025-05-22 14:34:41.129295+00	20250513062239_update_teacher_profile	\N	\N	2025-05-22 14:34:40.963088+00	1
f9f09ffd-d2ed-4d42-85fc-a036235413ea	78d6151d53221813cb7737207843c270b6b133b14630f8ab9016ba29f925ae80	2025-05-22 14:34:41.384339+00	20250522143407_update_submision_status_taken	\N	\N	2025-05-22 14:34:41.190578+00	1
e5f084b2-959d-49e5-8954-19817ce4492f	18bbca7901aeeae4181358d81fcffb04a3b447a461522f28dbec2a3cf7fd3d47	2025-06-12 17:26:34.101817+00	20250612172633_add_pending_status_banner_table	\N	\N	2025-06-12 17:26:33.879164+00	1
\.


--
-- Data for Name: comment_reaction; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.comment_reaction (id, comment_id, user_id, type, created_at) FROM stdin;
1af3fbea-fabc-460a-a5ed-3c4ec40fd350	1293e8cd-9632-47e8-8570-db6cfb954415	50285181-4b29-40cb-9c9c-fde1b1491419	like	2025-05-29 04:04:35.414
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notification (id, type, title, content, thumbnail_url, action_url, is_global, user_id, is_read, created_by, created_at, expires_at) FROM stdin;
069de292-54c2-44d8-a1e8-1f6b6ed955a0	advertisement	Thông báo quảng cáo: Nhận IELTS Insights miễn phí	Chúng mình biết bạn không còn xa lạ với các bài mẫu giải đề thi thật. Vì vậy, tại tạp chí IELTS Insights, ngoài bài mẫu, chúng mình sẽ hướng dẫn bạn chi tiết từng bước từ số 0, từ việc:\nCùng bạn phân tích cách lên idea & chống bí ý khi phát triển bài một cách cụ thể\nCùng bạn lập luận, viết cụ thể từng câu vô cùng cặn kẽ\nĐề xuất các cách xử lý lặp từ và cung cấp từ vựng theo từng topic\nVà đặc biệt, một số bài giải sẽ được đính kèm bài chấm của Cựu giám khảo IELTS để bạn thấy các bài essay chuẩn điểm cao trông như thế nào, cũng như tư duy chấm điểm của giáo khảo chấm thi.	https://cms.youpass.vn/assets/b72096f2-117a-4021-9662-91771c3bb03e?width=1500	https://ielts1984.vn/ielts-insights	t	\N	f	a3848bfb-aeac-4938-a9d0-7484c1da70d9	2025-06-05 14:54:38.704	\N
bec0b1f3-66a5-4911-a794-b1e8f4186c52	submission	Bài nộp của bạn đã được chấm điểm	Bài "Does workaholism have positive effects?" đã được chấm điểm. Giáo viên đã chấm điểm bài nộp của bạn.	https://img.freepik.com/vector-mien-phi/procrastination-concept-illustration_114360-17291.jpg	http://localhost:3001/lesson/writing/86e747e3-3f19-40cb-a93d-55ad77bf4122/result?submissionId=47924493-75ce-4050-9a96-9f3b85af70df	f	50285181-4b29-40cb-9c9c-fde1b1491419	f	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-17 14:03:15.718	\N
7b5bb085-b0e7-4240-b54b-7474372e945e	comment_mention	Bạn có bình luận mới tại bài chấm Does workaholism have positive effects?	Hallo	https://img.freepik.com/vector-mien-phi/procrastination-concept-illustration_114360-17291.jpg	http://localhost:3001/lesson/writing/86e747e3-3f19-40cb-a93d-55ad77bf4122/result?submissionId=47924493-75ce-4050-9a96-9f3b85af70df	f	a001fa67-2813-41a2-af2a-423d3c743198	f	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-17 14:22:31.915	\N
3dcbd2f3-7a39-4c5a-8937-4b204909996b	comment_mention	Bạn có bình luận mới tại bài chấm Does workaholism have positive effects?	Hallo cô	https://img.freepik.com/vector-mien-phi/procrastination-concept-illustration_114360-17291.jpg	http://localhost:3001/lesson/writing/86e747e3-3f19-40cb-a93d-55ad77bf4122/result?submissionId=47924493-75ce-4050-9a96-9f3b85af70df	f	a001fa67-2813-41a2-af2a-423d3c743198	f	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-17 14:22:55.975	\N
6914354c-5044-423b-b547-b2c48f2e53e3	submission	Bài nộp của bạn đã được chấm điểm	Bài "School uniforms should be mandatory in all schools" đã được chấm điểm. Giáo viên đã chấm điểm bài nộp của bạn.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEhFD80B20jGCrUK3yIO18HXvFLsN7Wm5MwPha	https://waebuns.com/lesson/writing/ec721b8c-4cbe-439d-b789-5c65e19f5e7f/result?submissionId=f1ed59f4-34a1-415a-aacd-9f9ae403bcaa	f	848b7f6b-85f2-44eb-933e-d3a798072003	f	a001fa67-2813-41a2-af2a-423d3c743198	2025-06-17 17:31:55.684	\N
\.


--
-- Data for Name: reference_data; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.reference_data (id, type, code, name, metadata, is_active, order_index, created_at, updated_at) FROM stdin;
a6f215c6-3e79-41bf-ac53-06362fb888fd	level	beginner	Beginner	{"description": "Beginner level", "recommended_level": "Beginner"}	t	1	2025-05-22 14:45:56.316	2025-05-22 14:45:56.316
ad5b7c44-08e7-4eba-ae93-72e3d8e1018f	level	intermediate	Intermediate	{"description": "Intermediate level", "recommended_level": "INTERMEDIATE"}	t	2	2025-05-22 14:45:56.388	2025-05-22 14:45:56.388
d7532007-eba4-44ec-bf3f-241d5868a346	level	advanced	Advanced	{"description": "Advanced level", "recommended_level": "Advanced"}	t	3	2025-05-22 14:45:56.418	2025-05-22 14:45:56.418
14c6538e-6296-4aeb-84e8-298d652fa0a3	topic	ielts	IELTS	{"description": "IELTS topic", "recommended_level": "IELTS"}	t	4	2025-05-22 14:45:56.448	2025-05-22 14:45:56.448
26a7154c-fd2c-4dfa-ad6b-7e11ccf8fec5	topic	toeic	TOEIC	{"description": "TOEIC topic", "recommended_level": "TOEIC"}	t	5	2025-05-22 14:45:56.478	2025-05-22 14:45:56.478
\.


--
-- Data for Name: student_profile; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.student_profile (id, user_id, target_study_duration, target_reading, target_listening, target_writing, target_speaking, next_exam_date, created_at, updated_at, deleted_at) FROM stdin;
96854073-d61b-4d3e-8945-4fff0351cd8b	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	0	5	5	5	5	2025-05-23 05:25:39.763	2025-05-23 04:42:53.3	2025-05-23 05:26:03.938	\N
c32046e9-613e-463a-99a9-89bd9704d815	84349163-ffca-4ca5-b4c0-82686ce16e7a	0	0	0	0	0	\N	2025-05-24 06:33:09.112	2025-05-24 06:33:09.112	\N
adbc2865-effb-45cd-8cf5-93dba8eb066b	56bb530c-d276-4b58-9d2b-bf3b15d034d8	120	7	7	8	6.5	2024-12-31 00:00:00	2025-05-22 14:45:56.704	2025-05-28 12:51:50.267	\N
862d1a22-e617-4240-b410-03b4eb3090c5	e092ff43-54a2-4b16-986f-b0474630bc34	0	0	0	0	0	\N	2025-06-06 07:36:08.035	2025-06-06 07:36:08.035	\N
b53e980b-a0ff-42af-8088-0426dfc87185	e3b98802-a44d-4200-ab70-c4c2bcd3d09a	0	0	0	0	0	\N	2025-06-06 14:13:06.773	2025-06-06 14:13:06.773	\N
8b28898f-a202-4175-8314-2fa5b4dd9344	b85eac34-9f98-4f7d-9575-973e55e057bc	0	0	0	0	0	\N	2025-06-09 09:47:10.068	2025-06-09 09:47:10.068	\N
8a08fd33-1a6b-40f0-b253-6e27c0a91912	a8f0b7c1-c43c-4148-a2d5-b44e0e1dc081	0	0	0	0	0	\N	2025-06-12 18:45:26.652	2025-06-12 18:45:26.652	\N
c3399d59-97d1-4c90-a998-47783ed4f17c	50285181-4b29-40cb-9c9c-fde1b1491419	0	8	8	8	7	2025-06-09 08:55:36.174	2025-05-23 13:55:54.95	2025-06-14 04:45:01.069	\N
956aedb8-1951-4fc5-adab-0af0e642cdea	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	0	5	6	6	7	2025-06-18 17:00:00	2025-06-12 15:36:18.024	2025-06-15 14:33:48.082	\N
da7b0be7-bf1f-4aa7-95cb-cd7174f42cc4	84720616-0d0e-415b-aba0-1eb465e9fb93	0	0	0	0	0	\N	2025-06-15 15:53:29.379	2025-06-15 15:53:29.379	\N
5a8fb69f-c78c-4343-9448-a5f3228cf8e9	c817735c-513c-4453-9e6e-9e9d7f25ab4c	0	7	7	8	8	2025-06-19 17:00:00	2025-06-16 09:48:10.653	2025-06-16 09:49:11.633	\N
2057147a-3071-4136-ab4d-6ae8538b7e86	275a813b-b2e3-42d3-8e77-149c3243a88c	0	0	0	0	0	\N	2025-06-17 16:15:10.373	2025-06-17 16:15:10.373	\N
0bd39606-c82f-4a71-8a15-f02a49cb10dc	848b7f6b-85f2-44eb-933e-d3a798072003	0	0	0	0	0	\N	2025-06-17 17:28:48.835	2025-06-17 17:28:48.835	\N
\.


--
-- Data for Name: study_activity; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.study_activity (id, user_id, activity_date, reading, listening, writing, speaking, total_minutes, created_at, updated_at) FROM stdin;
62c889dd-43f7-44fc-a17e-e1a1b3978fd3	56bb530c-d276-4b58-9d2b-bf3b15d034d8	2025-05-22 14:45:57.776	1	1	1	1	1	2025-05-22 14:45:57.776	2025-05-22 14:45:57.776
f1d750eb-4e1d-435f-b79e-076778f77c38	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	2025-05-23 00:00:00	1	1	0	1	2	2025-05-23 05:20:12.398	2025-05-23 05:24:02.461
d315c664-ee91-46cd-a18e-b2d007784679	56bb530c-d276-4b58-9d2b-bf3b15d034d8	2025-05-23 00:00:00	0	0	0	1	0	2025-05-23 14:05:22.897	2025-05-23 14:05:22.897
e9e41121-8bf5-4b3a-a4c5-b74138619742	56bb530c-d276-4b58-9d2b-bf3b15d034d8	2025-05-25 00:00:00	0	0	0	1	0	2025-05-25 07:58:01.857	2025-05-25 07:58:01.857
2b60e2d3-c594-452d-9f32-696c5a4c5583	56bb530c-d276-4b58-9d2b-bf3b15d034d8	2025-05-28 00:00:00	0	0	0	1	0	2025-05-28 12:47:28.997	2025-05-28 12:47:28.997
32461226-c7aa-471b-84d6-01f2eb72858a	50285181-4b29-40cb-9c9c-fde1b1491419	2025-05-29 00:00:00	0	2	0	0	2	2025-05-29 04:07:54.084	2025-05-29 04:08:03.337
826b2375-5189-4a68-ac0e-4c05b09339a2	56bb530c-d276-4b58-9d2b-bf3b15d034d8	2025-06-01 00:00:00	0	0	0	2	0	2025-06-01 08:09:07.867	2025-06-01 09:36:22.524
d1223c4a-96e7-4e85-ab24-4b1ef02ce470	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-05 00:00:00	1	1	0	5	2	2025-06-05 14:07:25.867	2025-06-05 14:34:07.929
2d97dfcf-9c55-419e-9801-f78f58578d6e	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-06 00:00:00	0	0	0	1	0	2025-06-06 14:04:48.722	2025-06-06 14:04:48.722
cdddeab6-d457-4b85-9848-3ad9428642fa	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	2025-06-06 00:00:00	0	0	0	1	0	2025-06-06 18:12:37.973	2025-06-06 18:12:37.973
e4ca1c99-80e3-49b1-a5ab-9b95012e6192	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-09 00:00:00	1	1	0	2	3	2025-06-09 08:56:20.237	2025-06-09 09:43:05.628
71eb2ca3-30ec-410e-8908-c8ba69c678b5	56bb530c-d276-4b58-9d2b-bf3b15d034d8	2025-06-11 00:00:00	0	0	0	1	0	2025-06-11 16:04:45.779	2025-06-11 16:04:45.779
f39b4106-bc78-452a-a366-d160b583950f	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	2025-06-12 00:00:00	1	1	0	1	2	2025-06-12 15:42:13.103	2025-06-12 15:46:13.965
cd3f0d5e-5314-43fb-bb34-5fcf3a738a3d	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-12 00:00:00	0	0	0	20	0	2025-06-12 09:36:50.622	2025-06-12 20:20:22.32
0fcf8d32-13ec-48b2-8807-9df8145d776f	56bb530c-d276-4b58-9d2b-bf3b15d034d8	2025-06-13 00:00:00	0	0	0	1	0	2025-06-13 07:45:19.129	2025-06-13 07:45:19.129
d1a01526-0108-4735-9fb2-03ab8c8d3492	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	2025-06-13 00:00:00	2	0	0	3	2	2025-06-13 07:57:28.447	2025-06-13 08:26:23.994
c8801740-32ab-42ed-8993-34618964c5f8	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	2025-06-15 00:00:00	0	0	0	1	0	2025-06-15 13:33:49.855	2025-06-15 13:33:49.855
815a4426-211e-4cbd-9971-185b0ddb3059	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-15 00:00:00	20	0	0	1	491	2025-06-15 09:57:35.219	2025-06-15 18:53:55.649
9e5fb6e1-3161-4a6f-838b-1eb96cb0309f	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-16 00:00:00	0	0	0	3	0	2025-06-16 04:58:51.482	2025-06-16 05:28:21.862
e9cd3e09-9425-47a3-bba7-8fc257cd9da3	c817735c-513c-4453-9e6e-9e9d7f25ab4c	2025-06-16 00:00:00	0	0	0	1	0	2025-06-16 09:57:29.208	2025-06-16 09:57:29.208
\.


--
-- Data for Name: teacher_profile; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.teacher_profile (id, user_id, teaching_experience, created_at, updated_at, deleted_at, certifications, intro_video_url_embed, long_bio, other, bankingqr_image_url) FROM stdin;
7603e862-1bcf-423c-b600-892184fdc3cd	48ddaeaf-1afe-4b0d-aa60-dd4a3188467e		2025-05-22 15:08:34.246	2025-05-22 15:08:34.246	\N					\N
d49a36b1-47ca-4b4d-9f90-c2850af68e24	a001fa67-2813-41a2-af2a-423d3c743198	5 năm kinh nghiệm giảng dạy cả trực tuyến và trên lớp	2025-05-22 14:45:56.636	2025-06-15 16:18:31.966	\N	Chứng chỉ IELTS 7.0	https://www.youtube.com/embed/2JzAHYg0zLY	Giáo viên tiếng Anh giàu kinh nghiệm với niềm đam mê giúp học sinh đạt được mục tiêu học ngôn ngữ của mình.	Chuyên về tiếng Anh thương mại và luyện thi	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEbc6O7Kfu4K3eP5VyfoadWZO0tDN7jIXAc1GS
\.


--
-- Data for Name: token_package; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.token_package (id, name, tokens, price_vnd, price_per_token, old_price_per_token, message, popular, created_at, updated_at, code) FROM stdin;
9c2ce563-ac26-4205-b1ca-cb403b5c89c9	Gói Nhỏ	20	25000	1250	1500	Phù hợp dùng thử	f	2025-05-22 14:45:57.841	2025-05-22 14:45:57.841	small
5768a2fc-c37e-40cf-aef9-42a5f5c9b95d	Gói Tiêu Chuẩn	100	100000	1000	1250	Phổ biến	t	2025-05-22 14:45:57.9	2025-05-22 14:45:57.9	standard
c8db1cd4-65b0-4424-b904-12603056b379	Gói Tiết Kiệm	300	250000	833	1000	Tiết kiệm nhất	f	2025-05-22 14:45:57.929	2025-05-22 14:45:57.929	savings
\.


--
-- Data for Name: token_wallet; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.token_wallet (id, user_id, balance, updated_at, created_at, deleted_at) FROM stdin;
4c0a91ba-8577-427d-bee2-e5258c01c939	a001fa67-2813-41a2-af2a-423d3c743198	130	2025-06-17 17:32:44.602	2025-05-22 15:55:29.357	\N
1216543b-925a-4a18-8b31-6dea70bbf811	84349163-ffca-4ca5-b4c0-82686ce16e7a	0	2025-05-24 06:33:10.426	2025-05-24 06:33:10.426	\N
29c8d83b-26c4-42c4-885d-a0b5ff066c2b	a8f0b7c1-c43c-4148-a2d5-b44e0e1dc081	30	2025-06-12 18:45:27.312	2025-06-12 18:45:27.312	\N
86e732d6-c398-4e5e-a161-fae21a824f7e	56bb530c-d276-4b58-9d2b-bf3b15d034d8	96	2025-06-13 07:45:18.838	2025-05-22 14:45:58.081	\N
2d26d1c4-b537-4146-90cc-bb7daaba66d0	e092ff43-54a2-4b16-986f-b0474630bc34	0	2025-06-06 07:36:09.132	2025-06-06 07:36:09.132	\N
8094ff5e-7ed1-4db1-be9f-f2346a7d8d20	e3b98802-a44d-4200-ab70-c4c2bcd3d09a	0	2025-06-06 14:13:08.033	2025-06-06 14:13:08.033	\N
e2026bb0-3668-409b-981b-f5c545ff02a2	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	269	2025-06-06 21:24:31.174	2025-05-23 04:42:54.548	\N
d9f6889d-b8da-4c9b-9c72-6107d820071c	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	518	2025-06-15 13:33:49.633	2025-06-12 15:36:18.757	\N
7e329236-e8fc-432b-956c-0577363fb47b	b85eac34-9f98-4f7d-9575-973e55e057bc	0	2025-06-09 09:47:11.195	2025-06-09 09:47:11.195	\N
45bb9712-2279-4259-b6b2-18d02b8db10f	84720616-0d0e-415b-aba0-1eb465e9fb93	30	2025-06-15 15:53:29.939	2025-06-15 15:53:29.939	\N
7ffb32cf-9008-46fb-aa21-961f301d894e	c817735c-513c-4453-9e6e-9e9d7f25ab4c	4	2025-06-16 10:47:13.051	2025-06-16 09:48:11.793	\N
e807a5e5-c6b9-4ed8-8eb2-df3a69b3b9e5	50285181-4b29-40cb-9c9c-fde1b1491419	232	2025-06-17 13:43:49.393	2025-05-23 13:55:56.606	\N
995bdb3c-fcbd-4993-bd2a-cfa46d6ad9cb	275a813b-b2e3-42d3-8e77-149c3243a88c	30	2025-06-17 16:15:10.966	2025-06-17 16:15:10.966	\N
3ddcb7ab-63f1-4fa2-a73e-e068eaa9bcfa	848b7f6b-85f2-44eb-933e-d3a798072003	45	2025-06-17 17:30:59.998	2025-06-17 17:28:49.484	\N
\.


--
-- Data for Name: transaction; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.transaction (id, user_id, package_id, amount_vnd, token_amount, "paymentType", transaction_id, status, payment_date, currency, transaction_type, reason, created_at, updated_at) FROM stdin;
31081bee-0199-4d80-ab7e-58506ed332bb	56bb530c-d276-4b58-9d2b-bf3b15d034d8	5768a2fc-c37e-40cf-aef9-42a5f5c9b95d	100000	100	bank	test-transaction-1	completed	2025-05-22 14:45:58.018	VND	token_purchase	\N	2025-05-22 14:45:58.019	2025-05-22 14:45:58.019
796d3359-d74a-43dc-92a7-73d8619c9a40	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-5	internal	ea646a51-3149-4d0f-a9f2-15fd6e7a89d8	completed	2025-05-22 14:47:57.015	VND	token_use	\N	2025-05-22 14:47:57.016	2025-05-22 14:47:57.016
bbcb6641-6a0f-46f5-801a-6fbe57bccd64	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	c37294c8-7dd9-4bd9-a705-78b840915111	completed	2025-05-22 15:55:29.097	VND	TOKEN_EARN	Earned tokens from grading submission	2025-05-22 15:55:29.098	2025-05-22 15:55:29.098
c4438733-e579-4bae-96ae-10efdc498e03	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-5	internal	45068bea-354f-467c-b19d-4a0ea829140a	completed	2025-05-22 16:01:50.896	VND	TOKEN_USE	\N	2025-05-22 16:01:50.896	2025-05-22 16:01:50.896
cb454154-ac45-4936-b4a7-91f68e5eb854	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	f1c7072a-c0f2-47c9-bed3-c266b0a91e6b	completed	2025-05-22 16:02:08.785	VND	TOKEN_EARN	Earned tokens from grading submission	2025-05-22 16:02:08.786	2025-05-22 16:02:08.786
06ecf84a-fb59-457e-a8dc-165074ce6833	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-10	internal	96371d23-9b92-4273-b17e-3f3c76847405	completed	2025-05-22 16:37:58.17	VND	TOKEN_WITHDRAW	\N	2025-05-22 16:37:58.171	2025-05-22 16:38:16.195
6eec6c78-3d86-4a83-85d8-1e727f35453e	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-20	internal	17b9b252-1a8c-4326-a170-4e3172a10e83	completed	2025-05-22 16:39:22.894	VND	TOKEN_WITHDRAW	\N	2025-05-22 16:39:22.896	2025-05-22 16:39:35.845
beb1b7ef-5f27-49e4-8203-4f5a931ec048	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-40	internal	d17084cb-c347-4cc1-87e2-9ef74ad1bf8f	completed	2025-05-22 16:40:02.844	VND	TOKEN_WITHDRAW	\N	2025-05-22 16:40:02.845	2025-05-22 16:40:07.287
cc50e459-1d83-448a-a6ca-ad962a814140	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-5	internal	0b0a7c98-558c-4fb5-8b9f-cc386dd5a8c5	completed	2025-05-22 16:59:40.549	VND	TOKEN_USE	\N	2025-05-22 16:59:40.55	2025-05-22 16:59:40.55
9f9313b7-5436-43bd-bba3-6588c6e52f7f	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	67341432-b906-4424-974d-d86b1be5da07	completed	2025-05-22 16:59:54.139	VND	TOKEN_EARN	Earned tokens from grading submission	2025-05-22 16:59:54.139	2025-05-22 16:59:54.139
0364ceb1-743e-4a92-a3c9-55aa87704a8d	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-5	internal	734fcdca-c974-44cf-ac17-cbb49bfd450a	completed	2025-05-22 16:59:58.558	VND	TOKEN_WITHDRAW	\N	2025-05-22 16:59:58.559	2025-05-22 17:00:29.013
594c5271-a110-405a-9ce7-cb8d01fa278b	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-5	internal	f6be05df-1cbc-4d5e-b6d3-9a3f9cdd45b0	completed	2025-05-22 17:01:08.69	VND	TOKEN_USE	\N	2025-05-22 17:01:08.691	2025-05-22 17:01:08.691
8d78b836-af39-4162-907d-fb6ed71c6bcb	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	f6c91176-4f78-41c4-a09d-3ac4ebbdebc4	completed	2025-05-22 17:01:20.068	VND	TOKEN_EARN	Earned tokens from grading submission	2025-05-22 17:01:20.069	2025-05-22 17:01:20.069
f3282e81-79e8-4c31-9b52-b2146410db72	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-5	internal	bdf0903c-c87c-4cea-ae82-55dad872fb53	completed	2025-05-22 17:01:25.412	VND	TOKEN_WITHDRAW	\N	2025-05-22 17:01:25.413	2025-05-22 17:01:31.759
bed22dd3-1f02-4aa1-80ff-7bbf16090b28	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250523_946228	pending	2025-05-23 04:47:34.63	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-05-23 04:47:34.631	2025-05-23 04:47:34.631
66cd4942-748d-43ac-a662-b14dbe68c6f3	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250523_745954	pending	2025-05-23 05:06:48.152	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-05-23 05:06:48.153	2025-05-23 05:06:48.153
06591b4d-5e5d-468e-ae1f-f2c70a1b78f0	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250523_59675	completed	2025-05-23 05:08:33.73	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-05-23 05:08:33.732	2025-05-23 05:09:14.758
7e548223-0e64-420b-9689-5adbc7b85e1e	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	\N	0	-5	internal	4620deb7-10bd-49fe-9dbd-b1bee13535e5	completed	2025-05-23 05:10:57.194	VND	TOKEN_USE	\N	2025-05-23 05:10:57.195	2025-05-23 05:10:57.195
cd793028-ed23-4696-822c-b60c52a0f04f	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	\N	0	-5	internal	cc4c13d9-e398-4e38-870e-cf8f74c5eecc	completed	2025-05-23 05:19:48.712	VND	TOKEN_USE	\N	2025-05-23 05:19:48.714	2025-05-23 05:19:48.714
f3e3d171-c0ef-434b-a78e-845005d0bc16	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	\N	0	-10	internal	cccf4551-83df-4920-8045-5582b414d1ae	completed	2025-05-23 05:20:11.71	VND	TOKEN_USE	\N	2025-05-23 05:20:11.711	2025-05-23 05:20:11.711
dba06da8-1bbb-4c30-8afe-dd389995274d	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	36e3db68-715a-46e4-9d84-fe9bbb832f36	completed	2025-05-23 05:37:20.787	VND	TOKEN_EARN	Earned tokens from grading submission	2025-05-23 05:37:20.789	2025-05-23 05:37:20.789
599c7cf1-92c1-4e0d-a6e4-68eff9a95956	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-5	internal	5d0958f2-e2b8-416c-861c-5a4b5cfd02cb	completed	2025-05-23 05:39:31.096	VND	TOKEN_WITHDRAW	\N	2025-05-23 05:39:31.098	2025-05-23 05:40:04.51
c69e2d4e-214c-494f-ac1e-431274e6a200	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-10	internal	f8bfe3cc-b202-48e1-a5f5-d7fd2b8f7352	completed	2025-05-23 14:05:22.367	VND	TOKEN_USE	\N	2025-05-23 14:05:22.367	2025-05-23 14:05:22.367
3359eda6-2560-4fd9-951e-624a9df08800	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	70a8e69b-f183-418d-93d1-4698cff70b2c	completed	2025-05-25 07:55:30.24	VND	TOKEN_EARN	Earned tokens from grading submission	2025-05-25 07:55:30.242	2025-05-25 07:55:30.242
3fc3e98c-e6bc-4635-ada8-1c23c4515280	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-2	internal	7d183c2e-0e50-4a3c-809a-3dc7ed8d678b	completed	2025-05-25 07:57:41.744	VND	TOKEN_USE	\N	2025-05-25 07:57:41.745	2025-05-25 07:57:41.745
371dbdcd-eb20-481c-97c5-1230ee6fe69a	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-10	internal	c7984948-2a6f-4a79-b0d4-7ed6880179fb	completed	2025-05-25 07:58:01.212	VND	TOKEN_USE	\N	2025-05-25 07:58:01.213	2025-05-25 07:58:01.213
31f7a16a-ba34-46dd-a705-dca267a1b4a4	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-5	internal	6e67cb27-55a5-4227-a95c-3344c91ceaae	completed	2025-05-25 08:14:45.136	VND	TOKEN_USE	\N	2025-05-25 08:14:45.137	2025-05-25 08:14:45.137
a53d371a-d90b-46d5-abd7-32f848b55e4f	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	97b7600b-22f2-41d6-9fec-e2ea5c277116	completed	2025-05-25 08:16:19.73	VND	TOKEN_EARN	Earned tokens from grading submission	2025-05-25 08:16:19.734	2025-05-25 08:16:19.734
42ce6ead-0077-4fa9-b7e0-65d512b0e8d5	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-10	internal	77bacfd5-3f23-49b0-a48e-b2677fed5299	completed	2025-05-25 08:17:52.26	VND	TOKEN_WITHDRAW	\N	2025-05-25 08:17:52.261	2025-05-25 08:18:29.104
171fcec1-2d4e-4cc4-9998-5925ac8d0151	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250528_7098	pending	2025-05-28 08:33:47.257	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-05-28 08:33:47.258	2025-05-28 08:33:47.258
e0d4cf39-9dbd-4e7e-af69-084e92e1ecfc	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-2	internal	b61df20a-6539-41d9-aa94-aa6c272bb921	completed	2025-05-28 12:46:03.103	VND	TOKEN_USE	\N	2025-05-28 12:46:03.105	2025-05-28 12:46:03.105
dfb9f8fb-98b8-45b8-9d1f-79e15eedac32	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-1	internal	a7091357-2ac5-45e7-a463-6669f4e593f4	completed	2025-05-28 12:47:02.323	VND	TOKEN_USE	\N	2025-05-28 12:47:02.324	2025-05-28 12:47:02.324
b503ea85-89a1-43e7-b9e4-8201c2dc2832	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-10	internal	47652d35-8dd6-484e-bcde-2e67bc08c4d1	completed	2025-05-28 12:47:28.483	VND	TOKEN_USE	\N	2025-05-28 12:47:28.484	2025-05-28 12:47:28.484
5726a7db-f40f-450a-b596-64934cf68af1	56bb530c-d276-4b58-9d2b-bf3b15d034d8	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250528_337529	pending	2025-05-28 12:52:52.395	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-05-28 12:52:52.396	2025-05-28 12:52:52.396
4e022b19-aa04-46ce-9cf3-f5aeace25476	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250601_338040	pending	2025-06-01 07:59:06.293	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-01 07:59:06.294	2025-06-01 07:59:06.294
5f046c18-3c4b-4db2-af4e-bcc4e312ff15	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250601_387289	pending	2025-06-01 08:00:43.459	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-01 08:00:43.46	2025-06-01 08:00:43.46
ff182aff-eb1d-44ff-8388-671e656f194f	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250601_970631	pending	2025-06-01 08:05:58.253	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-01 08:05:58.254	2025-06-01 08:05:58.254
5bab6532-c535-425a-9c50-e40d1f70ccbf	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-10	internal	8e4ca0c8-5512-4734-9124-b169b1080ffb	completed	2025-06-01 08:09:07.176	VND	TOKEN_USE	\N	2025-06-01 08:09:07.177	2025-06-01 08:09:07.177
0e89706a-c0dc-48f7-9a25-d21ac319efcc	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-10	internal	3dc8edff-33cc-4382-898f-4d93a2c9bde6	completed	2025-06-01 09:36:21.66	VND	TOKEN_USE	\N	2025-06-01 09:36:21.661	2025-06-01 09:36:21.661
fd27326a-6f90-46b9-93fa-a410c3fc7156	a001fa67-2813-41a2-af2a-423d3c743198	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250603_940348	pending	2025-06-03 16:12:33.08	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-03 16:12:33.081	2025-06-03 16:12:33.081
6bfd00c3-7f98-4873-87ba-80a0c5a65e78	a001fa67-2813-41a2-af2a-423d3c743198	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250603_415881	pending	2025-06-03 17:20:11.717	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-03 17:20:11.718	2025-06-03 17:20:11.718
390770e7-6c42-4e9c-8de9-f7515f58aacf	56bb530c-d276-4b58-9d2b-bf3b15d034d8	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250604_217212	pending	2025-06-03 17:22:56.423	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-03 17:22:56.424	2025-06-03 17:22:56.424
081da8b8-335e-443d-a233-605b80324f5d	56bb530c-d276-4b58-9d2b-bf3b15d034d8	5768a2fc-c37e-40cf-aef9-42a5f5c9b95d	100000	100	momo	250604_286843	completed	2025-06-03 17:30:57.532	VND	TOKEN_PURCHASE	Purchase 100 tokens	2025-06-03 17:30:57.533	2025-06-03 17:31:22.908
3be30709-a886-4c80-99b9-ac3f86d071a9	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250603_644598	pending	2025-06-03 17:43:52.863	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-03 17:43:52.865	2025-06-03 17:43:52.865
b18f4378-a79e-4b44-80e6-8e56800a4c23	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250603_318927	pending	2025-06-03 17:45:23.326	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-03 17:45:23.328	2025-06-03 17:45:23.328
a34bc7bd-c34d-4d1e-b308-a4244d5cfee4	50285181-4b29-40cb-9c9c-fde1b1491419	5768a2fc-c37e-40cf-aef9-42a5f5c9b95d	100000	100	momo	250603_80692	pending	2025-06-03 17:47:05.105	VND	TOKEN_PURCHASE	Purchase 100 tokens	2025-06-03 17:47:05.107	2025-06-03 17:47:05.107
ee0bb841-a4d8-43b9-bf20-cb3422419fc2	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250603_874216	pending	2025-06-03 18:29:47.052	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-03 18:29:47.053	2025-06-03 18:29:47.053
26f5ca97-7909-40b0-8cd8-84aad5da3913	56bb530c-d276-4b58-9d2b-bf3b15d034d8	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250603_947288	pending	2025-06-03 18:31:00.668	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-03 18:31:00.669	2025-06-03 18:31:00.669
f1acd024-cbb2-4274-bac6-71888a6bd400	56bb530c-d276-4b58-9d2b-bf3b15d034d8	5768a2fc-c37e-40cf-aef9-42a5f5c9b95d	100000	100	momo	250603_762270	pending	2025-06-03 18:31:46.581	VND	TOKEN_PURCHASE	Purchase 100 tokens	2025-06-03 18:31:46.582	2025-06-03 18:31:46.582
c3bf9393-151e-4427-b223-617b10b66e8e	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250603_722198	pending	2025-06-03 18:52:05.026	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-03 18:52:05.028	2025-06-03 18:52:05.028
60c9ad74-a66c-4c24-98df-62a1b0f18943	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250604_854633	completed	2025-06-04 05:05:54.761	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-04 05:05:54.763	2025-06-04 05:06:29.159
cdaf06dd-3e9a-48a0-9277-2c65fa9d609b	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	ab6ee9d9-8497-4686-8cfa-5871e57a39e6	completed	2025-06-04 15:04:14.882	VND	TOKEN_USE	\N	2025-06-04 15:04:14.884	2025-06-04 15:04:14.884
71328aea-7d19-4b2b-a1dd-1336baa7613c	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-2	internal	e0734bb5-fcf3-4eb7-a927-7dbe3918d16d	completed	2025-06-04 15:06:07.164	VND	TOKEN_USE	\N	2025-06-04 15:06:07.165	2025-06-04 15:06:07.165
6595dd1c-3adb-4127-aa83-c8c2bb301581	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	26a813d4-44df-4ac3-be68-a9cfed60ac61	completed	2025-06-04 15:06:19.513	VND	TOKEN_USE	\N	2025-06-04 15:06:19.514	2025-06-04 15:06:19.514
39fd8941-e68f-4f4d-9d39-4061699aaf2b	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-5	internal	7ba459a2-7f13-47e2-9d54-6644c815b993	completed	2025-06-05 14:04:31.431	VND	TOKEN_USE	\N	2025-06-05 14:04:31.432	2025-06-05 14:04:31.432
aa4ccd5c-2ef6-4ffb-b8a5-f802bc91ca39	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	7ee663c0-2932-4ce9-95f2-3af9f7474587	completed	2025-06-05 14:06:05.803	VND	TOKEN_EARN	Earned tokens from grading submission	2025-06-05 14:06:05.805	2025-06-05 14:06:05.805
092bfc77-fba2-4d3b-8112-2169dbc361fa	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	d79047c7-f751-4dd8-8c26-ea5fbea8d58e	completed	2025-06-05 14:07:25.059	VND	TOKEN_USE	\N	2025-06-05 14:07:25.06	2025-06-05 14:07:25.06
d141ea5f-188a-4d59-9190-d30b01dbe0f6	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	1dca2cce-9058-42ea-954a-474c0e5b8051	completed	2025-06-05 14:08:01.591	VND	TOKEN_USE	\N	2025-06-05 14:08:01.592	2025-06-05 14:08:01.592
0b1da3c3-80e2-4119-b5da-8c61ea8a4036	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	0ec8624a-8ac3-48d5-946a-8dcd7a630784	completed	2025-06-05 14:10:59.942	VND	TOKEN_USE	\N	2025-06-05 14:10:59.943	2025-06-05 14:10:59.943
740946b7-d5b1-46db-a94e-21dbd646d86b	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	9ac68ac1-d600-47ed-9e6c-3e52e2550254	completed	2025-06-05 14:27:06.08	VND	TOKEN_USE	\N	2025-06-05 14:27:06.081	2025-06-05 14:27:06.081
9467df15-c749-49de-9b45-2b3c06cda44b	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	4e4b94f5-30bb-4cee-b7ab-88eea21b2b0e	completed	2025-06-05 14:27:49.465	VND	TOKEN_USE	\N	2025-06-05 14:27:49.466	2025-06-05 14:27:49.466
4870570b-20fc-43e1-b441-082b245dd27a	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	04ca80c7-cee2-4d6c-ad73-b37586a6e942	completed	2025-06-05 14:34:53.593	VND	TOKEN_USE	\N	2025-06-05 14:34:53.594	2025-06-05 14:34:53.594
0b8efb8d-ba4b-4501-af46-116ad8d9640d	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-2	internal	39f21ea5-5baf-47be-9de7-f33be3810579	completed	2025-06-05 14:35:45.329	VND	TOKEN_USE	\N	2025-06-05 14:35:45.33	2025-06-05 14:35:45.33
7334babb-e965-4e8a-8e94-d57608140e93	e092ff43-54a2-4b16-986f-b0474630bc34	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250606_182179	pending	2025-06-06 08:10:49.704	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-06 08:10:49.705	2025-06-06 08:10:49.705
836e85ec-ab57-4fda-97af-ad93de54dfeb	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	8b14ceec-eb9f-4686-b380-fdc60d083fa2	completed	2025-06-06 14:04:47.877	VND	TOKEN_USE	\N	2025-06-06 14:04:47.878	2025-06-06 14:04:47.878
fe0b3d19-4dfc-4eb0-a09d-3eb2d5f9b861	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	\N	0	-10	internal	64c46ce7-c245-4f10-a90e-dceaf5577e39	completed	2025-06-06 18:12:37.5	VND	TOKEN_USE	\N	2025-06-06 18:12:37.501	2025-06-06 18:12:37.501
c5cc5240-22be-4b15-a49a-73e2f298b64d	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	\N	0	-1	internal	6ddd8662-3d70-4170-b553-f8f0c0c02c27	completed	2025-06-06 21:24:30.815	VND	TOKEN_USE	\N	2025-06-06 21:24:30.816	2025-06-06 21:24:30.816
99b40819-91a2-45c1-9504-9ed69db3a978	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	c1f92ab7-8ab0-4ba0-becc-396653eacfff	completed	2025-06-09 08:56:19.579	VND	TOKEN_USE	\N	2025-06-09 08:56:19.581	2025-06-09 08:56:19.581
3b9d1b9a-4bae-4b9d-b6bb-49de23fb35b2	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	a71b210b-9a35-465f-834b-810aabe328e2	completed	2025-06-09 09:27:02.169	VND	TOKEN_USE	\N	2025-06-09 09:27:02.171	2025-06-09 09:27:02.171
fb0d3e54-2c5b-4259-b983-4ba0bd1792c3	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	de9c2d44-d027-41dc-813d-239cebb95c1d	completed	2025-06-09 09:28:27.947	VND	TOKEN_USE	\N	2025-06-09 09:28:27.949	2025-06-09 09:28:27.949
c34214bb-9d65-439f-9ce1-b047ca6089b6	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-2	internal	33b0ec8e-382e-4c9f-a2e3-3f96a594b06a	completed	2025-06-09 09:32:09.187	VND	TOKEN_USE	\N	2025-06-09 09:32:09.188	2025-06-09 09:32:09.188
054470a2-948e-4aa6-b793-2f05795bfe37	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-5	internal	7c425271-6433-488c-af67-8f23d8a5c57e	completed	2025-06-09 09:33:49.066	VND	TOKEN_USE	\N	2025-06-09 09:33:49.068	2025-06-09 09:33:49.068
5e7f01f6-e00e-4939-ad3f-4d8b294e430d	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	5b455f6a-8f1b-43fa-ab12-e9f2a0eb8edd	completed	2025-06-09 09:36:23.411	VND	TOKEN_EARN	Earned tokens from grading submission	2025-06-09 09:36:23.415	2025-06-09 09:36:23.415
1772b693-a50d-418b-b1d1-b26cbce69d7d	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	756dbe1d-5bee-435d-9b37-3cd2aa120fa7	completed	2025-06-09 09:37:39.013	VND	TOKEN_USE	\N	2025-06-09 09:37:39.014	2025-06-09 09:37:39.014
1ed092ea-b05d-452c-91b8-e070518c5929	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-1	internal	92b927f8-113c-4892-a594-51ad1ce30323	completed	2025-06-11 16:00:22.895	VND	TOKEN_USE	\N	2025-06-11 16:00:22.897	2025-06-11 16:00:22.897
084e4852-bd4f-4c3e-9536-f99626c7c9fd	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-1	internal	238afc78-7426-42ed-8437-bdb5890ccf0d	completed	2025-06-11 16:03:01.239	VND	TOKEN_USE	\N	2025-06-11 16:03:01.24	2025-06-11 16:03:01.24
78be6a41-5cb0-41ae-ab9e-7e31d4a9b1fa	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-1	internal	166cbd57-b3f9-43a5-b4eb-1513d9a0c5ae	completed	2025-06-11 16:04:17.487	VND	TOKEN_USE	\N	2025-06-11 16:04:17.489	2025-06-11 16:04:17.489
3631462c-059b-4ba8-ae36-324eddc29dc9	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-10	internal	a6af8bc3-d8d2-40fa-b8d6-8309fcbcc538	completed	2025-06-11 16:04:45.473	VND	TOKEN_USE	\N	2025-06-11 16:04:45.474	2025-06-11 16:04:45.474
700b6ef5-df67-4f59-bb4d-4bacb10fae6e	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-1	internal	65bfc707-31d7-4549-9a1e-4261ee13c0c3	completed	2025-06-11 16:05:45.799	VND	TOKEN_USE	\N	2025-06-11 16:05:45.8	2025-06-11 16:05:45.8
ff545129-efed-4ac8-872b-4b209fcd194f	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	9d0ca9ea-0bda-4599-8894-c75a996a86ad	completed	2025-06-11 16:08:22.608	VND	TOKEN_USE	\N	2025-06-11 16:08:22.609	2025-06-11 16:08:22.609
592c1d68-6e15-419e-b72a-e606a1d4b4bf	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	f156c134-3c61-47e0-adb1-bfc418801926	completed	2025-06-12 08:24:57.197	VND	TOKEN_USE	\N	2025-06-12 08:24:57.2	2025-06-12 08:24:57.2
18a5eaa2-7536-4cb3-96f6-507a37c67775	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	0c99e21d-c7fe-403c-bcea-eaab9fb39a1a	completed	2025-06-12 08:25:39.911	VND	TOKEN_USE	\N	2025-06-12 08:25:39.912	2025-06-12 08:25:39.912
91f5b1a6-c077-475f-b921-9a5fb47460ba	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-2	internal	1894b089-74d9-445e-a605-7fd657d83adb	completed	2025-06-12 08:26:41.587	VND	TOKEN_USE	\N	2025-06-12 08:26:41.588	2025-06-12 08:26:41.588
d357dcc4-cf2e-4419-927c-b24bad878bee	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-2	internal	5c0254b7-0267-4ecc-b6c2-479fea45f659	completed	2025-06-12 08:38:22.366	VND	TOKEN_USE	\N	2025-06-12 08:38:22.368	2025-06-12 08:38:22.368
f7d608c7-f7a6-4d9d-bbe9-66cc2451f843	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	6675eaff-e042-4e49-9e2d-a9680441768f	completed	2025-06-12 08:38:29.928	VND	TOKEN_USE	\N	2025-06-12 08:38:29.929	2025-06-12 08:38:29.929
87871166-97a8-4cb3-b6ce-4bf34c359eb7	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-2	internal	27cf27e4-cb22-4e6b-b7a5-10c04734a241	completed	2025-06-12 08:49:32.506	VND	TOKEN_USE	\N	2025-06-12 08:49:32.507	2025-06-12 08:49:32.507
fdb93210-b731-4a47-8fa8-c91a5bd16a16	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-2	internal	0bcd5887-2a55-46b4-a827-ec995effad7b	completed	2025-06-12 08:53:39.009	VND	TOKEN_USE	\N	2025-06-12 08:53:39.01	2025-06-12 08:53:39.01
426e13f8-e0da-47ba-bc69-4c6684ac7261	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-2	internal	47459c5b-d7ba-4233-801b-677d9069eaa7	completed	2025-06-12 09:09:00.313	VND	TOKEN_USE	\N	2025-06-12 09:09:00.314	2025-06-12 09:09:00.314
dceef690-eb5f-4ee6-ab27-b6cc0eea8089	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	2b2e25a6-39d4-4757-999e-c5b232f1c48f	completed	2025-06-12 09:14:07.338	VND	TOKEN_USE	\N	2025-06-12 09:14:07.34	2025-06-12 09:14:07.34
bba806b8-38f2-43a6-88bb-2fedc059094f	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	10076447-c24c-4b36-8456-566bcac595a3	completed	2025-06-12 09:14:23.285	VND	TOKEN_USE	\N	2025-06-12 09:14:23.286	2025-06-12 09:14:23.286
ca3ae758-8df7-48bf-8878-001e166a4748	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	cfebb72c-3736-4d02-9998-79daf65187a8	completed	2025-06-12 09:22:36.263	VND	TOKEN_USE	\N	2025-06-12 09:22:36.264	2025-06-12 09:22:36.264
1cb44f52-61c4-4e9a-b915-82cff2e7efd0	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	a300a6c2-4ed4-4ebd-9df6-762f4ae0fb42	completed	2025-06-12 09:36:49.837	VND	TOKEN_USE	\N	2025-06-12 09:36:49.839	2025-06-12 09:36:49.839
6224087f-fd78-4aac-b3f1-c87bafb0c16b	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-5	internal	6cb582a3-58ab-4d1c-9442-21bc3f2a25f2	completed	2025-06-06 10:56:07.595	VND	TOKEN_WITHDRAW	\N	2025-06-06 10:56:07.597	2025-06-12 16:02:15.916
85767307-6bd1-42b0-92c1-6292c24d0887	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	b00b9b7f-01a0-42d5-b674-8e7cce26b38b	completed	2025-06-12 10:42:15.194	VND	TOKEN_USE	\N	2025-06-12 10:42:15.195	2025-06-12 10:42:15.195
012aa124-17d2-4e51-89ac-93470f9411b6	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	bc374dd4-86ae-41e1-8d74-6c59cc4f0dc1	completed	2025-06-12 10:47:06.181	VND	TOKEN_USE	\N	2025-06-12 10:47:06.182	2025-06-12 10:47:06.182
d0fe7285-b337-4eb1-9621-0ce3ca21c7d5	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	ef10a872-0412-47cc-8b32-62a54421bc1c	completed	2025-06-12 10:51:23.371	VND	TOKEN_USE	\N	2025-06-12 10:51:23.373	2025-06-12 10:51:23.373
988be96c-37c9-47db-a32a-6da37ba38609	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	9e26b8ef-7fad-46eb-bfc5-2e9147f3ba8d	completed	2025-06-12 10:57:15.661	VND	TOKEN_USE	\N	2025-06-12 10:57:15.662	2025-06-12 10:57:15.662
15bf6ef9-2a0e-40d7-a7ec-80ca6a38d4da	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	621806a2-de52-4db0-b613-ca1233f792a5	completed	2025-06-12 11:02:05.168	VND	TOKEN_USE	\N	2025-06-12 11:02:05.17	2025-06-12 11:02:05.17
7cee845a-06de-43b9-a977-67b1e2c08cc3	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	c2bf039f-d5d4-474c-9435-cb88b32a3396	completed	2025-06-12 11:49:30.444	VND	TOKEN_USE	\N	2025-06-12 11:49:30.445	2025-06-12 11:49:30.445
d6b70929-74f7-4a02-acdf-8bedd3c83647	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	61f3e13b-a929-488d-b666-e54b8103bdbe	completed	2025-06-12 11:51:07.142	VND	TOKEN_USE	\N	2025-06-12 11:51:07.143	2025-06-12 11:51:07.143
63a9821f-85a0-4fa0-9437-4762b87b8925	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	5712c695-434f-4b42-8866-eea8bfce9585	completed	2025-06-12 12:01:21.05	VND	TOKEN_USE	\N	2025-06-12 12:01:21.051	2025-06-12 12:01:21.051
9221b22d-1a61-4078-83fc-c864a778036c	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	af838432-0c7f-4262-ac8b-200c75165f6e	completed	2025-06-12 12:04:09.229	VND	TOKEN_USE	\N	2025-06-12 12:04:09.23	2025-06-12 12:04:09.23
7c75742b-b6b1-49cc-9cc4-6c41e3fd53a3	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	2b1690f7-86de-43ce-a882-698aa96ef2d6	completed	2025-06-12 12:05:34.007	VND	TOKEN_USE	\N	2025-06-12 12:05:34.008	2025-06-12 12:05:34.008
fd575652-cd44-4235-9dda-15692b77a03d	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	586f68a0-cf2a-4e1f-8db4-2c4d1b6c2cc4	completed	2025-06-12 12:44:04.971	VND	TOKEN_USE	\N	2025-06-12 12:44:04.972	2025-06-12 12:44:04.972
79247c53-c180-493c-836b-caf127dadb93	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	8ef258ce-2527-41f8-b8b9-d210cfe967dc	completed	2025-06-12 12:48:55.348	VND	TOKEN_USE	\N	2025-06-12 12:48:55.349	2025-06-12 12:48:55.349
52b199f8-ec5c-4c98-b8b4-5ec471707c2a	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	e6fb20aa-b328-423d-901e-e8cd2e740ad1	completed	2025-06-12 12:52:38.745	VND	TOKEN_USE	\N	2025-06-12 12:52:38.747	2025-06-12 12:52:38.747
cada1845-eeaa-497d-b209-7c57f6650746	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	046b7b5b-c6dd-48b3-9ef6-1e6e6d51903b	completed	2025-06-12 12:55:30.988	VND	TOKEN_USE	\N	2025-06-12 12:55:30.99	2025-06-12 12:55:30.99
f50e0008-1b85-46c5-80a5-f3158bcdf604	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	58a3e4aa-6588-4488-990a-4dd4efada82c	completed	2025-06-12 13:02:32.399	VND	TOKEN_USE	\N	2025-06-12 13:02:32.4	2025-06-12 13:02:32.4
3f935cd7-6583-4476-8cbc-0fd1b000eaf1	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	67c29a40-021a-4b6a-986d-4eb476d409d9	completed	2025-06-12 13:34:20.507	VND	TOKEN_USE	\N	2025-06-12 13:34:20.508	2025-06-12 13:34:20.508
066aebe5-73bf-43a3-880d-93f0f4c800de	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	a08f88e4-bf0e-4769-bad3-a796e077e865	completed	2025-06-12 14:15:49.24	VND	TOKEN_USE	\N	2025-06-12 14:15:49.243	2025-06-12 14:15:49.243
ba2e33a0-bf8b-457b-91fb-a9561e518ac6	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250612_818543	pending	2025-06-12 14:30:36.826	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-12 14:30:36.827	2025-06-12 14:30:36.827
e7553f19-a156-4252-ae1d-d6146f13f9e7	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250612_70503	pending	2025-06-12 15:14:46.335	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-12 15:14:46.336	2025-06-12 15:14:46.336
7021be1c-dc2a-4245-a6ec-c884cba7fd97	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250612_488378	pending	2025-06-12 15:15:37.026	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-12 15:15:37.027	2025-06-12 15:15:37.027
e8e185f5-3426-4dcd-ad54-76ce4671c7d2	a001fa67-2813-41a2-af2a-423d3c743198	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250612_664571	completed	2025-06-12 15:16:46.446	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-12 15:16:46.448	2025-06-12 15:21:28.772
e68cbcdd-279f-4a3e-9f4e-4474fa2a1cbe	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250612_729864	completed	2025-06-12 15:36:46.947	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-12 15:36:46.949	2025-06-12 15:37:13.787
1bec23f7-a441-4e5b-926b-8638a3470b02	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-2	internal	ecd6dbdf-2adb-45e4-8b69-dd0f37238f34	completed	2025-06-12 15:38:19.489	VND	TOKEN_USE	\N	2025-06-12 15:38:19.49	2025-06-12 15:38:19.49
8bac2d98-0774-49f7-a0c0-6a387574fac8	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-1	internal	1c8ea426-21bc-43b2-a04d-27872ae55e6b	completed	2025-06-12 15:38:44.943	VND	TOKEN_USE	\N	2025-06-12 15:38:44.944	2025-06-12 15:38:44.944
c795c129-f2e9-4236-82dd-ef4aaeb5aa6f	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-5	internal	c84aa038-08a6-477c-84ae-2264747d2bf9	completed	2025-06-12 15:41:44.359	VND	TOKEN_USE	\N	2025-06-12 15:41:44.36	2025-06-12 15:41:44.36
efa6ca91-aa3c-4a97-ace9-495ff3782eb1	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-10	internal	7d07cb72-904e-43c1-af3b-411643f1da20	completed	2025-06-12 15:42:12.483	VND	TOKEN_USE	\N	2025-06-12 15:42:12.484	2025-06-12 15:42:12.484
b281aff7-73d0-4c6c-b856-fda8ff5738c9	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250612_843001	pending	2025-06-12 15:48:01.117	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-12 15:48:01.118	2025-06-12 15:48:01.118
0012a5d7-3eaf-4002-905c-832ee5fffdc5	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	05f988ad-4ac1-45cb-8090-94edf9e50883	completed	2025-06-12 15:51:28.676	VND	TOKEN_EARN	Earned tokens from grading submission	2025-06-12 15:51:28.681	2025-06-12 15:51:28.681
69a23159-de42-499b-9a6d-1bbd8e4464d1	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-5	internal	82307d75-ac43-4ffc-993a-5eb317999085	completed	2025-06-06 14:41:55.012	VND	TOKEN_WITHDRAW	\N	2025-06-06 14:41:55.013	2025-06-12 16:02:12.936
6b1e5a97-92c4-42cd-8adb-9681741601f1	a8f0b7c1-c43c-4148-a2d5-b44e0e1dc081	\N	0	30	internal	a22565d3-3976-4dd3-9372-f3ebaa1b3038	completed	2025-06-12 18:45:27.072	VND	TOKEN_EARN	Welcome bonus for new user	2025-06-12 18:45:27.073	2025-06-12 18:45:27.073
cb6b9d2c-81d0-4c4e-b539-ea858800ba36	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-2	internal	56c51dcc-d3c0-4b9a-81a0-d3189d1f8b5f	failed	2025-06-12 19:17:05.096	VND	TOKEN_WITHDRAW	\N	2025-06-12 19:17:05.097	2025-06-12 19:29:25.283
bde82d09-cc73-4589-afbf-5ab8770be8b6	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-2	internal	f89fd30e-823a-4f23-ae84-a5e380526244	failed	2025-06-12 19:16:47.943	VND	TOKEN_WITHDRAW	\N	2025-06-12 19:16:47.944	2025-06-12 19:29:26.148
7b9580d8-c7d4-4a99-90eb-9ae3081ec127	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-1	internal	708b0534-2043-4084-baf2-2d60cf526589	failed	2025-06-12 19:16:43.806	VND	TOKEN_WITHDRAW	\N	2025-06-12 19:16:43.807	2025-06-12 19:29:26.974
8464c1ed-5cd5-4101-9a5a-bceab3af168d	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-1	internal	21b6c4f1-207d-4c7f-83a6-4b327f89d209	failed	2025-06-12 19:14:34.719	VND	TOKEN_WITHDRAW	\N	2025-06-12 19:14:34.72	2025-06-12 19:29:27.408
67c5b361-7ce4-4c05-91b4-6005ca87c9c5	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-2	internal	a222c573-32bf-489a-950e-d80c19ec972c	failed	2025-06-12 19:13:50.758	VND	TOKEN_WITHDRAW	\N	2025-06-12 19:13:50.758	2025-06-12 19:29:27.781
1ea26fde-e2fb-42f6-9df1-b2ceba178794	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-305	internal	b2530316-0476-4136-8267-8d856bffd0d3	failed	2025-06-12 19:10:00.838	VND	TOKEN_WITHDRAW	\N	2025-06-12 19:10:00.839	2025-06-12 19:29:28.213
94290781-ef9e-4ad4-adf1-84f4645545c5	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-305	internal	41dfbfe6-9efa-45c6-8b1c-6867e7fb0cb5	failed	2025-06-12 16:06:19.954	VND	TOKEN_WITHDRAW	\N	2025-06-12 16:06:19.956	2025-06-12 19:29:37.419
52d61bc5-b104-4e03-8ad6-344ca83e142c	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	c33193c8-491a-4bc3-990a-8e03e3bd2a74	completed	2025-06-12 20:16:17.084	VND	TOKEN_USE	\N	2025-06-12 20:16:17.085	2025-06-12 20:16:17.085
d7cca47a-e89d-4f87-9b6e-8f65b5588623	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250612_834716	completed	2025-06-12 20:17:09.051	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-12 20:17:09.052	2025-06-12 20:17:34.342
004ec6af-740f-4088-bfdb-feaad90f7e2c	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	71455094-b320-416c-956a-32f32b161650	completed	2025-06-12 20:18:02.786	VND	TOKEN_USE	\N	2025-06-12 20:18:02.787	2025-06-12 20:18:02.787
c1a9cfab-5d9a-41cc-8916-bf47a0f9e75f	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	e69e64fb-38f2-4a5a-aa22-205792222b24	completed	2025-06-12 20:20:21.61	VND	TOKEN_USE	\N	2025-06-12 20:20:21.611	2025-06-12 20:20:21.611
016e7e58-64e1-493f-8fad-91173946125e	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-5	internal	fb709e1c-bef6-47a5-8400-665cbe0b045e	completed	2025-06-12 20:23:13.137	VND	TOKEN_USE	\N	2025-06-12 20:23:13.138	2025-06-12 20:23:13.138
d0d0ede4-4d64-4fda-8930-c600d3d566a9	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	d92fd835-ecde-4cb3-91ae-3ca1974e90e2	completed	2025-06-12 20:23:42.224	VND	TOKEN_EARN	Earned tokens from grading submission	2025-06-12 20:23:42.228	2025-06-12 20:23:42.228
c668c9aa-ed04-460e-913b-9aa879c0b255	56bb530c-d276-4b58-9d2b-bf3b15d034d8	\N	0	-10	internal	47af6f70-3ef2-4c8a-91f0-ea4d4854c25d	completed	2025-06-13 07:45:18.338	VND	TOKEN_USE	\N	2025-06-13 07:45:18.339	2025-06-13 07:45:18.339
427efc27-8426-44a1-acfa-3cadf76de24a	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-1	internal	a4dcce35-3c61-4b9d-ab39-c67f9e949263	completed	2025-06-13 07:55:00.079	VND	TOKEN_USE	\N	2025-06-13 07:55:00.08	2025-06-13 07:55:00.08
067ef4fd-d3bd-4251-9845-b738dcb3e117	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-2	internal	770a1f87-e557-4216-8934-71701c80e253	completed	2025-06-13 07:55:49.481	VND	TOKEN_USE	\N	2025-06-13 07:55:49.482	2025-06-13 07:55:49.482
82275d95-9e87-4d16-b1e7-1a6ece22975f	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-5	internal	5f0d320c-e0cb-4ea1-9519-4e7512b8200a	completed	2025-06-13 07:56:51.993	VND	TOKEN_USE	\N	2025-06-13 07:56:51.994	2025-06-13 07:56:51.994
c9af578e-0609-4dc8-acbc-571c2240288f	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-10	internal	d07c3c15-01a9-4831-acc6-3e5886c43052	completed	2025-06-13 07:57:27.616	VND	TOKEN_USE	\N	2025-06-13 07:57:27.617	2025-06-13 07:57:27.617
73ef8dc8-b7a4-4e51-931c-96a6d6ac4d3e	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-10	internal	46a7eac4-bd65-4d5d-8ac0-abb8e572c419	completed	2025-06-13 07:58:20.586	VND	TOKEN_USE	\N	2025-06-13 07:58:20.588	2025-06-13 07:58:20.588
d3c92a1f-096a-4049-9e33-7177a523ff69	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250613_971160	completed	2025-06-13 08:06:27.148	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-13 08:06:27.149	2025-06-13 08:06:42.958
ebb61004-f4b0-4be9-94c3-ff1385ea9b43	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250613_94509	pending	2025-06-13 08:04:42.924	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-13 08:04:42.925	2025-06-13 08:04:42.925
bc13f3b2-517d-4d4c-9a15-e6357bbc6091	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-1	internal	c322bf5a-6be1-43df-8d97-4d7561e2e1dd	completed	2025-06-13 08:24:05.835	VND	TOKEN_USE	\N	2025-06-13 08:24:05.836	2025-06-13 08:24:05.836
aba2fe4a-1281-4299-b0c1-eaf3aa32f1a9	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-2	internal	8af36c65-1659-47b4-b637-f2e2ce64421c	completed	2025-06-13 08:24:38.343	VND	TOKEN_USE	\N	2025-06-13 08:24:38.344	2025-06-13 08:24:38.344
4d9231e0-af25-4634-9f0c-39293c6badad	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-5	internal	f90cf4d2-cd92-42a4-86f8-9c6f401a04cc	completed	2025-06-13 08:25:03.863	VND	TOKEN_USE	\N	2025-06-13 08:25:03.864	2025-06-13 08:25:03.864
87fd291c-99c5-46d9-bbf6-2ff7044c3c66	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-10	internal	d6cedeb5-c9b5-4933-b182-03281da6e9a1	completed	2025-06-13 08:25:18.168	VND	TOKEN_USE	\N	2025-06-13 08:25:18.169	2025-06-13 08:25:18.169
9d3f6a14-a45d-4354-bf25-49409cb7b26a	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-1	internal	72b7edd3-4e6c-4cee-b6de-23444a6aa3fd	completed	2025-06-13 08:30:10.165	VND	TOKEN_USE	\N	2025-06-13 08:30:10.166	2025-06-13 08:30:10.166
5ffae674-0c0b-4c0e-80c8-a71f867a1c27	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-2	internal	684832d0-adcf-42b5-9b20-633f14ff0d20	completed	2025-06-13 08:30:33.854	VND	TOKEN_USE	\N	2025-06-13 08:30:33.855	2025-06-13 08:30:33.855
d25ed644-7b06-433f-b13c-6a4b6d3be6fb	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-5	internal	fc27c5dd-8414-41ac-9926-b0ca4a13041e	completed	2025-06-13 08:31:00.218	VND	TOKEN_USE	\N	2025-06-13 08:31:00.219	2025-06-13 08:31:00.219
7196bf7a-a346-4505-b52b-58c8d5ea24cf	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	7430dcf9-95a2-41a1-a1b0-d85b2d3fc13a	completed	2025-06-13 08:32:57.928	VND	TOKEN_EARN	Earned tokens from grading submission	2025-06-13 08:32:57.931	2025-06-13 08:32:57.931
bceef529-f772-422d-831b-194044d66d4d	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	aae6aba8-2d4d-486a-bbab-1559ddbe9d1f	completed	2025-06-14 05:29:21.844	VND	TOKEN_EARN	Earned tokens from grading submission	2025-06-14 05:29:21.847	2025-06-14 05:29:21.847
b9a4f692-186a-4f4f-8118-989eaff8466f	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	27b79ba9-16da-40e4-a98f-954c84192b3b	completed	2025-06-15 09:20:19.801	VND	TOKEN_USE	\N	2025-06-15 09:20:19.802	2025-06-15 09:20:19.802
374be29f-b4ef-4c50-98d2-4216b585ab59	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	e74b50ae-804f-4bdc-8491-7bf923cc89ca	completed	2025-06-15 09:21:13.199	VND	TOKEN_USE	\N	2025-06-15 09:21:13.201	2025-06-15 09:21:13.201
c5a741ee-a7c5-4b72-88da-497ec98ef9df	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-2	internal	aaf9fd02-adc8-47c2-8878-4801d59f3da2	completed	2025-06-15 09:22:26.598	VND	TOKEN_USE	\N	2025-06-15 09:22:26.599	2025-06-15 09:22:26.599
63dca983-062f-48b2-b4c8-5df9911568ef	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-5	internal	821ac137-e51f-4985-80a1-35b40376f13b	completed	2025-06-15 09:23:02.303	VND	TOKEN_USE	\N	2025-06-15 09:23:02.304	2025-06-15 09:23:02.304
4f0af275-56fa-4574-8ac3-9befaf1f8d0b	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	020fd0af-42a4-4c40-bd29-18ab988771b0	completed	2025-06-15 09:24:19.808	VND	TOKEN_EARN	Earned tokens from grading submission	2025-06-15 09:24:19.813	2025-06-15 09:24:19.813
e0357877-ef01-4a0e-b45f-fc96a2940a11	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250615_441997	pending	2025-06-15 09:28:17.21	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-15 09:28:17.211	2025-06-15 09:28:17.211
c4b926ce-0359-423b-80b5-d17428ab13eb	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-200	internal	25101a3d-c45f-452e-9cc4-cc01b2f1fabc	completed	2025-06-15 09:25:30.354	VND	TOKEN_WITHDRAW	\N	2025-06-15 09:25:30.355	2025-06-15 09:30:51.916
b89c90cd-3c9d-4d9e-a5e9-65087ed4cf74	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	309ad250-ba8f-432d-a6ab-4882e7366614	completed	2025-06-15 09:39:33.769	VND	TOKEN_USE	\N	2025-06-15 09:39:33.77	2025-06-15 09:39:33.77
d36cd8ca-b51e-4b66-9747-17b763e425eb	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-2	internal	2561965e-c23a-432a-8b8b-f707bbb837ef	completed	2025-06-15 09:43:20.098	VND	TOKEN_USE	\N	2025-06-15 09:43:20.099	2025-06-15 09:43:20.099
baf25270-0217-4f3a-a00d-2f3bf1f3318b	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	6d557f22-cbe6-4faa-9a88-ad35fbc930f5	completed	2025-06-15 09:57:34.226	VND	TOKEN_USE	\N	2025-06-15 09:57:34.227	2025-06-15 09:57:34.227
aa655ecd-8fb5-437a-ad7a-c09be7f153e1	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	\N	0	-10	internal	d966dc91-0f30-4e3b-85d1-bc38940b52cf	completed	2025-06-15 13:33:49.139	VND	TOKEN_USE	\N	2025-06-15 13:33:49.14	2025-06-15 13:33:49.14
954fdcda-c14f-4ed0-b50f-55c18679d9fc	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-1	internal	b12fe94a-efbf-4671-b261-dd46db0b179a	failed	2025-06-15 09:17:32.739	VND	TOKEN_WITHDRAW	\N	2025-06-15 09:17:32.74	2025-06-15 13:41:40.534
d736ef0f-81c5-40cf-b2b8-02e93e66bf9c	84720616-0d0e-415b-aba0-1eb465e9fb93	\N	0	30	internal	540203d5-a729-470a-8d7b-b8816f18501f	completed	2025-06-15 15:53:29.717	VND	TOKEN_EARN	Welcome bonus for new user	2025-06-15 15:53:29.718	2025-06-15 15:53:29.718
7180c093-389f-4daf-86b0-07a63bb3fcfd	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-6	internal	d9b858a3-5d43-4a97-8d3b-4a8909fa2109	completed	2025-06-15 16:19:05.744	VND	TOKEN_WITHDRAW	\N	2025-06-15 16:19:05.744	2025-06-15 16:32:43.219
6bfaef9f-474b-4a1a-8a18-5d06a9699f96	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	8f790f9a-3e5d-41cf-8dab-49cfb011a4b6	completed	2025-06-15 16:40:17.541	VND	TOKEN_USE	\N	2025-06-15 16:40:17.542	2025-06-15 16:40:17.542
ddf0e94a-4633-410a-a3d7-230ce0391987	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-2	internal	0dffeba4-ae40-4758-8eb6-7820b94e87e9	completed	2025-06-15 16:40:57.044	VND	TOKEN_USE	\N	2025-06-15 16:40:57.045	2025-06-15 16:40:57.045
972aa309-228e-4b60-92ab-4747fb4e816d	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-9	internal	a1b1110b-a34a-4f38-969c-77ec5191e1d8	failed	2025-06-16 04:38:26.366	VND	TOKEN_WITHDRAW	\N	2025-06-16 04:38:26.367	2025-06-16 04:38:38.177
f14e332a-97ba-4557-95cd-834473e589f2	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-1	internal	a1608571-2ceb-42a3-8a47-5b91535755f3	failed	2025-06-15 17:05:05.707	VND	TOKEN_WITHDRAW	\N	2025-06-15 17:05:05.708	2025-06-16 04:38:38.983
3c6a3701-7712-4926-a9c8-6001ee2f565e	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	-9	internal	297b79ef-51ca-4ae2-a9c0-79df5095ebe3	failed	2025-06-16 04:38:41.909	VND	TOKEN_WITHDRAW	\N	2025-06-16 04:38:41.91	2025-06-16 04:43:35.991
47eb80db-6680-4671-8e4b-01e7249343fb	a001fa67-2813-41a2-af2a-423d3c743198	\N	8998	-9	internal	86bb957c-5341-4fc7-864d-95addebac7ad	failed	2025-06-16 04:41:27.035	VND	TOKEN_WITHDRAW	\N	2025-06-16 04:41:27.036	2025-06-16 04:43:36.706
ad1803f2-3e30-4495-857b-9a836254ceaa	a001fa67-2813-41a2-af2a-423d3c743198	\N	9998	-10	internal	2be608e9-67f8-4a4c-8f03-1f524441232d	failed	2025-06-16 04:41:40.722	VND	TOKEN_WITHDRAW	\N	2025-06-16 04:41:40.723	2025-06-16 04:43:37.3
d53cefcc-b2d0-408e-a17c-60f3f4746ce6	a001fa67-2813-41a2-af2a-423d3c743198	\N	8000	-10	internal	4761def7-81b8-4790-9277-4e21a0cad009	failed	2025-06-16 04:43:33.053	VND	TOKEN_WITHDRAW	\N	2025-06-16 04:43:33.053	2025-06-16 04:44:05.638
8b390854-7541-4c4b-a55e-6e8402baa687	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	07a8c759-12bb-4b21-a21b-550e100724ce	completed	2025-06-16 04:51:50.77	VND	TOKEN_USE	\N	2025-06-16 04:51:50.771	2025-06-16 04:51:50.771
c4a889b6-6db9-4c5d-a1bb-33b3480a3db1	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-1	internal	b26dbcaf-f697-4e39-bf68-1274eb9cee63	completed	2025-06-16 04:57:05.277	VND	TOKEN_USE	\N	2025-06-16 04:57:05.278	2025-06-16 04:57:05.278
9b0af8e9-427f-4303-8012-5f7e33e55a19	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-2	internal	8ec27c7a-80f4-4100-9c97-ec97053bc551	completed	2025-06-16 04:58:17.021	VND	TOKEN_USE	\N	2025-06-16 04:58:17.022	2025-06-16 04:58:17.022
c2e7ed37-81aa-4e44-b772-89db1c6a78f1	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	a156b7d3-5a07-459d-9aae-63258f21ecb5	completed	2025-06-16 04:58:51.132	VND	TOKEN_USE	\N	2025-06-16 04:58:51.133	2025-06-16 04:58:51.133
ff38e3c7-558e-4604-bc73-b15564e130f3	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	5603cea5-f33e-4968-b098-12d83bda3212	completed	2025-06-16 05:23:03.25	VND	TOKEN_USE	\N	2025-06-16 05:23:03.251	2025-06-16 05:23:03.251
fad73d33-b372-4214-a53d-a34d8ef9ad7a	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-10	internal	d0fe1dd8-81ab-487c-8830-df65df1d86f4	completed	2025-06-16 05:28:21.513	VND	TOKEN_USE	\N	2025-06-16 05:28:21.514	2025-06-16 05:28:21.514
0eb36e33-6aa9-4c6c-aff2-f5eeefb41dd5	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250616_250177	pending	2025-06-16 07:12:00.828	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-16 07:12:00.83	2025-06-16 07:12:00.83
3aa52130-bee3-4e44-87f3-3eebe5c6ea59	50285181-4b29-40cb-9c9c-fde1b1491419	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250616_935852	pending	2025-06-16 07:12:20.276	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-16 07:12:20.277	2025-06-16 07:12:20.277
79af7304-c1af-4f30-89f1-1305c23c8782	c817735c-513c-4453-9e6e-9e9d7f25ab4c	\N	0	30	internal	20ed48eb-fe46-4e88-a9a7-841f469bf4f4	completed	2025-06-16 09:48:11.335	VND	TOKEN_EARN	Welcome bonus for new user	2025-06-16 09:48:11.336	2025-06-16 09:48:11.336
a76379f4-68ef-43a5-9ab0-6e45db212e2e	c817735c-513c-4453-9e6e-9e9d7f25ab4c	\N	0	-1	internal	4fea6b5f-edf5-4b98-b83a-74bcff808a08	completed	2025-06-16 09:55:48.707	VND	TOKEN_USE	\N	2025-06-16 09:55:48.708	2025-06-16 09:55:48.708
34cd49d5-9b0c-4764-97ab-f8c728f7e138	c817735c-513c-4453-9e6e-9e9d7f25ab4c	\N	0	-2	internal	7ce4f2e7-3776-44e4-9e2f-8440a64d2149	completed	2025-06-16 09:56:36.235	VND	TOKEN_USE	\N	2025-06-16 09:56:36.236	2025-06-16 09:56:36.236
d1647d64-050f-4b59-8b37-cd067e0d2e2d	c817735c-513c-4453-9e6e-9e9d7f25ab4c	\N	0	-5	internal	70a1ce65-7a28-4647-b422-9c1f262d6223	completed	2025-06-16 09:56:57.858	VND	TOKEN_USE	\N	2025-06-16 09:56:57.859	2025-06-16 09:56:57.859
60977a89-a4f7-4b87-9b27-caa0e71ecf7f	c817735c-513c-4453-9e6e-9e9d7f25ab4c	\N	0	-10	internal	c82882ca-095d-4151-a9be-38bdd7529106	completed	2025-06-16 09:57:28.655	VND	TOKEN_USE	\N	2025-06-16 09:57:28.656	2025-06-16 09:57:28.656
b1857ef7-6a8e-4267-a326-2f9152bc81aa	c817735c-513c-4453-9e6e-9e9d7f25ab4c	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250616_710886	pending	2025-06-16 10:01:05.561	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-16 10:01:05.562	2025-06-16 10:01:05.562
5c35eacb-2669-4f02-aaf0-e116c014c8ee	c817735c-513c-4453-9e6e-9e9d7f25ab4c	c8db1cd4-65b0-4424-b904-12603056b379	250000	300	momo	250616_222884	pending	2025-06-16 10:03:01.846	VND	TOKEN_PURCHASE	Purchase 300 tokens	2025-06-16 10:03:01.847	2025-06-16 10:03:01.847
09ddd68a-2860-4d57-b984-887ac06bf235	c817735c-513c-4453-9e6e-9e9d7f25ab4c	9c2ce563-ac26-4205-b1ca-cb403b5c89c9	25000	20	momo	250616_28263	pending	2025-06-16 10:03:08.826	VND	TOKEN_PURCHASE	Purchase 20 tokens	2025-06-16 10:03:08.827	2025-06-16 10:03:08.827
3d9ee9c7-7128-49f4-991c-89c38203c9e9	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	6b637f51-6ca3-4151-af8a-e00e20c33488	completed	2025-06-16 10:21:34.4	VND	TOKEN_EARN	Earned tokens from grading submission	2025-06-16 10:21:34.402	2025-06-16 10:21:34.402
26f55186-3de2-416c-8e96-b67131c7e372	c817735c-513c-4453-9e6e-9e9d7f25ab4c	\N	0	-5	internal	96af027c-27d4-48c6-b397-39f3487cd33c	completed	2025-06-16 10:24:19.039	VND	TOKEN_USE	\N	2025-06-16 10:24:19.041	2025-06-16 10:24:19.041
f6ae758c-35d6-42ff-b29c-03206ac367f1	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	39094e62-9624-4b80-8f90-379fc68e5093	completed	2025-06-16 10:24:47.607	VND	TOKEN_EARN	Earned tokens from grading submission	2025-06-16 10:24:47.612	2025-06-16 10:24:47.612
bfcce900-7118-42c7-a551-b31777886561	a001fa67-2813-41a2-af2a-423d3c743198	\N	8000	-10	internal	4f351362-2112-4adf-b7ad-69a8d65c4023	failed	2025-06-16 10:26:50.547	VND	TOKEN_WITHDRAW	\N	2025-06-16 10:26:50.548	2025-06-16 10:36:55.75
fe4d8628-e488-44f5-9bc9-8e1deec5940f	c817735c-513c-4453-9e6e-9e9d7f25ab4c	\N	0	-1	internal	f677f342-bd05-4351-b206-0fa455161b98	completed	2025-06-16 10:46:42.877	VND	TOKEN_USE	\N	2025-06-16 10:46:42.879	2025-06-16 10:46:42.879
b9bcbd38-8e4a-4b14-8115-f3815a83efcf	c817735c-513c-4453-9e6e-9e9d7f25ab4c	\N	0	-2	internal	e4604d96-6fc8-4bab-b1be-9c0fce764218	completed	2025-06-16 10:47:12.744	VND	TOKEN_USE	\N	2025-06-16 10:47:12.746	2025-06-16 10:47:12.746
022ddc2f-3c14-480f-9ade-c60368d07b20	c817735c-513c-4453-9e6e-9e9d7f25ab4c	9c2ce563-ac26-4205-b1ca-cb403b5c89c9	25000	20	momo	250616_705376	pending	2025-06-16 10:47:36.518	VND	TOKEN_PURCHASE	Purchase 20 tokens	2025-06-16 10:47:36.52	2025-06-16 10:47:36.52
e3813baf-f93b-4684-9f79-a11c3f850897	50285181-4b29-40cb-9c9c-fde1b1491419	9c2ce563-ac26-4205-b1ca-cb403b5c89c9	25000	20	momo	250617_219707	pending	2025-06-17 12:32:44.627	VND	TOKEN_PURCHASE	Purchase 20 tokens	2025-06-17 12:32:44.628	2025-06-17 12:32:44.628
0e2ebe4f-5364-4ac3-800a-82927e56671f	a001fa67-2813-41a2-af2a-423d3c743198	\N	80000	-100	internal	007884d1-1ae9-4ab3-a67e-81d53fc61db1	failed	2025-06-16 04:44:11.232	VND	TOKEN_WITHDRAW	\N	2025-06-16 04:44:11.232	2025-06-17 13:17:33.798
f9aeaa10-3d27-4a5d-b1cd-06bca30d0087	50285181-4b29-40cb-9c9c-fde1b1491419	9c2ce563-ac26-4205-b1ca-cb403b5c89c9	25000	20	momo	250617_349611	completed	2025-06-17 13:32:35.72	VND	TOKEN_PURCHASE	Purchase 20 tokens	2025-06-17 13:32:35.721	2025-06-17 13:33:02.508
cc2e18c5-4123-4cae-94e6-9ba6e979bb5e	50285181-4b29-40cb-9c9c-fde1b1491419	\N	0	-5	internal	2ef59b30-f423-493f-a399-96a28a0bba27	completed	2025-06-17 13:43:49.142	VND	TOKEN_USE	\N	2025-06-17 13:43:49.144	2025-06-17 13:43:49.144
c5a686b2-817c-479f-8216-ee357b5cd835	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	f2354abb-cc30-4320-a80f-0dc01037e8d7	completed	2025-06-17 14:03:15.203	VND	TOKEN_EARN	Earned tokens from grading submission	2025-06-17 14:03:15.204	2025-06-17 14:03:15.204
61a6d6cd-9ae5-4f64-9006-b612fb9e188c	275a813b-b2e3-42d3-8e77-149c3243a88c	\N	0	30	internal	33870280-1df3-4f53-b890-ddabc3b7a3e0	completed	2025-06-17 16:15:10.726	VND	TOKEN_EARN	Welcome bonus for new user	2025-06-17 16:15:10.728	2025-06-17 16:15:10.728
89e54835-cb43-4ba7-a06a-af1765968470	848b7f6b-85f2-44eb-933e-d3a798072003	\N	0	30	internal	726e1541-9428-433d-a757-bcb79d4f8758	completed	2025-06-17 17:28:49.226	VND	TOKEN_EARN	Welcome bonus for new user	2025-06-17 17:28:49.227	2025-06-17 17:28:49.227
6fe1d383-6f2f-4f09-86e6-b7251af452f6	848b7f6b-85f2-44eb-933e-d3a798072003	9c2ce563-ac26-4205-b1ca-cb403b5c89c9	25000	20	momo	250617_158149	completed	2025-06-17 17:29:43.129	VND	TOKEN_PURCHASE	Purchase 20 tokens	2025-06-17 17:29:43.13	2025-06-17 17:30:14.775
01ca9151-45f1-4b15-bd94-83d271fc105f	848b7f6b-85f2-44eb-933e-d3a798072003	\N	0	-5	internal	b98ff08f-c7de-408c-ae7f-60d0ea050203	completed	2025-06-17 17:30:59.808	VND	TOKEN_USE	\N	2025-06-17 17:30:59.809	2025-06-17 17:30:59.809
ac71f2c6-e63f-4248-9d4f-ca0ff119d9d4	a001fa67-2813-41a2-af2a-423d3c743198	\N	0	5	internal	c3048780-b333-4cd4-ab6a-373027483c47	completed	2025-06-17 17:31:55.585	VND	TOKEN_EARN	Earned tokens from grading submission	2025-06-17 17:31:55.589	2025-06-17 17:31:55.589
36ea1e86-3fea-4576-a011-b8758b6323d9	a001fa67-2813-41a2-af2a-423d3c743198	\N	7200	-9	internal	bdbf2626-f61d-4d86-999a-861bc80a8bd7	completed	2025-06-17 17:32:22.778	VND	TOKEN_WITHDRAW	\N	2025-06-17 17:32:22.782	2025-06-17 17:32:44.541
\.


--
-- Data for Name: vocabulary; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.vocabulary (id, term, meaning, example_sentence, image_url, reference_link, reference_name, repetition_level, next_review, created_by, created_at, updated_at) FROM stdin;
883c3357-2d6d-4705-95b1-fe546b0c429e	ubiquitous	{"present, appearing, or found everywhere"}	Mobile phones have become ubiquitous in modern society.	https://example.com/image.jpg	https://example.com/reference	Reference Name	0	2025-05-22 14:45:57.233	a001fa67-2813-41a2-af2a-423d3c743198	2025-05-22 14:45:57.234	2025-05-22 14:45:57.234
3c974b11-c65f-424c-99a1-7b486c62af13	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	\N	\N	\N	5	2025-06-22 05:26:33.064	a2c0e4b1-dc4e-4650-a96c-0f5bccafc03f	2025-05-23 04:45:42.298	2025-05-23 05:26:33.241
322d8b1b-5194-49a0-a738-0b8c56c8f009	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	\N	\N	\N	1	2025-06-03 08:12:43.152	56bb530c-d276-4b58-9d2b-bf3b15d034d8	2025-05-28 12:46:47.314	2025-06-01 08:12:43.467
dfc528b3-6828-4c45-a62e-e9f4b3e86412	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	\N	\N	\N	1	2025-06-03 08:12:43.953	56bb530c-d276-4b58-9d2b-bf3b15d034d8	2025-05-25 07:59:36.674	2025-06-01 08:12:44.182
0ed1a0e2-693f-44d0-9418-c07a9c1e21eb	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	\N	\N	\N	1	2025-06-03 08:12:44.916	56bb530c-d276-4b58-9d2b-bf3b15d034d8	2025-05-23 14:04:55.61	2025-06-01 08:12:45.264
df2050dc-5308-4644-be88-d72eee8db4e4	Hello	{"Xin chào","Chào hỏi","Chào bạn"}	Hello, how are you?	https://images.pexels.com/photos/954599/pexels-photo-954599.jpeg?auto=compress&cs=tinysrgb&h=350			0	\N	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-05 14:36:28.541	2025-06-05 14:36:28.541
64560ed2-0685-4b10-aca3-da8f738251b5	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	\N	\N	\N	1	2025-06-08 11:58:37.62	e092ff43-54a2-4b16-986f-b0474630bc34	2025-06-06 08:09:55.388	2025-06-06 11:58:37.803
8d9d2dac-2b5a-451f-a3eb-daafc8ab1764	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	\N	\N	\N	1	\N	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-09 09:31:13.012	2025-06-09 09:31:13.012
6bb344ef-ae22-4ed8-bc65-0d29c288cd4a	narrow	{"chật hẹp"}	Narrow - mind people	https://images.pexels.com/photos/1093946/pexels-photo-1093946.jpeg?auto=compress&cs=tinysrgb&h=350			1	2025-06-11 09:43:54.196	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-05 14:37:38.448	2025-06-09 09:43:54.424
3c38e70e-c838-4f50-9e06-2c892d5ce18c	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	\N	\N	\N	1	\N	b85eac34-9f98-4f7d-9575-973e55e057bc	2025-06-09 09:47:51.496	2025-06-09 09:47:51.496
1cf74b62-5713-4677-8b33-700857e74b11	hi	{"Xin chào","Chào hỏi","Chào bạn"}	Hello, how are you?				1	2025-06-13 16:10:11.047	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-09 09:43:29.953	2025-06-11 16:10:11.255
a44ed678-b2f5-450f-b5a3-b481f74aaec7	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	\N	\N	\N	1	\N	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-12 08:38:15.286	2025-06-12 08:38:15.286
acd508f5-711c-463b-8570-1fd150a6821a	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	\N	\N	\N	1	\N	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-12 08:57:23.225	2025-06-12 08:57:23.225
09429813-ee77-4fa2-bd5d-807d2584b61c	workaholism	{"compulsiveness about working"}	His personal life has certainly paid the price for his workaholism.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE8Y3fjmvjWAixkLwGz4PUNlCrB32nvS9DFIpc	https://www.vocabulary.com/dictionary/workaholism	Vocabulary.com	1	\N	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-12 09:08:38.88	2025-06-12 09:08:38.88
ddb6eec5-fbd1-4751-8de2-9a8ed676eec7	competitiveness	{"an aggressive willingness to compete"}	eventually compromising their productivity as well as the competitiveness of the local economy.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEtPsOJQU751Yhfg6e2LqHyVuO3bUi4rzBEc09	https://www.vocabulary.com/dictionary/competitiveness	Vocabulary.com	1	\N	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-12 09:08:41.434	2025-06-12 09:08:41.434
f2878d2b-fe9b-4da9-b00a-5e808ad6eaaf	competitiveness	{"an aggressive willingness to compete"}	eventually compromising their productivity as well as the competitiveness of the local economy.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEtPsOJQU751Yhfg6e2LqHyVuO3bUi4rzBEc09	https://www.vocabulary.com/dictionary/competitiveness	Vocabulary.com	2	2025-06-16 15:46:36.08	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	2025-06-12 15:38:07.258	2025-06-12 15:46:36.367
44ffc49e-6d29-4f76-b875-214ae4bcf3c5	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE6XWLceVa9HvtmCzUZoWN10p2qhedE87yuTDx	https://www.vocabulary.com/dictionary/narrow-minded	Vocabulary.com	3	2025-06-19 15:46:37.047	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	2025-06-12 15:37:59.093	2025-06-12 15:46:37.201
da082bee-798d-4349-ad6f-3866437be1ec	Hello	{"Xin chào","Chào hỏi","Chào bạn"}	Hello, how are you?	https://images.pexels.com/photos/954599/pexels-photo-954599.jpeg?auto=compress&cs=tinysrgb&h=350			2	2025-06-16 15:47:03.189	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	2025-06-12 15:46:51.1	2025-06-12 15:47:03.393
17e291a2-0749-445e-ba83-0a800c55d6cc	Hello	{"Xin chào","Chào hỏi","Chào bạn"}	Hello, how are you?				2	2025-06-17 08:03:54.319	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	2025-06-13 08:03:45.689	2025-06-13 08:03:54.636
881989e7-874d-4f8a-8f38-3a1644f65da8	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE6XWLceVa9HvtmCzUZoWN10p2qhedE87yuTDx	https://www.vocabulary.com/dictionary/narrow-minded	Vocabulary.com	1	\N	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	2025-06-13 08:24:26.806	2025-06-13 08:24:26.806
c8d7c1c6-1b5e-49a0-a471-b365e645863a	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE6XWLceVa9HvtmCzUZoWN10p2qhedE87yuTDx	https://www.vocabulary.com/dictionary/narrow-minded	Vocabulary.com	1	\N	1f3aa11e-6d15-44e3-857f-d3ff28f348fd	2025-06-13 08:30:17.96	2025-06-13 08:30:17.96
630cfbb8-e583-4875-bc6e-c7618f9462bd	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE6XWLceVa9HvtmCzUZoWN10p2qhedE87yuTDx	https://www.vocabulary.com/dictionary/narrow-minded	Vocabulary.com	1	\N	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-15 16:40:06.418	2025-06-15 16:40:06.418
e02bc9b5-0ebf-4ddd-a639-64631512b995	workaholism	{"compulsiveness about working"}	His personal life has certainly paid the price for his workaholism.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE8Y3fjmvjWAixkLwGz4PUNlCrB32nvS9DFIpc	https://www.vocabulary.com/dictionary/workaholism	Vocabulary.com	1	\N	c817735c-513c-4453-9e6e-9e9d7f25ab4c	2025-06-16 09:56:19.108	2025-06-16 09:56:19.108
1cdb37a7-3475-4520-87cc-9ae46c643136	competitiveness	{"an aggressive willingness to compete"}	eventually compromising their productivity as well as the competitiveness of the local economy.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TEtPsOJQU751Yhfg6e2LqHyVuO3bUi4rzBEc09	https://www.vocabulary.com/dictionary/competitiveness	Vocabulary.com	1	2025-06-18 10:00:37.228	c817735c-513c-4453-9e6e-9e9d7f25ab4c	2025-06-16 09:56:21.516	2025-06-16 10:00:37.528
6ce01fa9-9781-4a50-b270-6e2c7f331baf	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE6XWLceVa9HvtmCzUZoWN10p2qhedE87yuTDx	https://www.vocabulary.com/dictionary/narrow-minded	Vocabulary.com	1	\N	c817735c-513c-4453-9e6e-9e9d7f25ab4c	2025-06-16 10:10:02.604	2025-06-16 10:10:02.604
d5c5ebc0-6bcb-4d0a-8c9b-88c9230be77d	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE6XWLceVa9HvtmCzUZoWN10p2qhedE87yuTDx	https://www.vocabulary.com/dictionary/narrow-minded	Vocabulary.com	1	\N	c817735c-513c-4453-9e6e-9e9d7f25ab4c	2025-06-16 10:47:01.79	2025-06-16 10:47:01.79
7b190516-e59a-451c-b217-0e49e4a54e50	Narrow-minded	{"Having or showing a lack of understanding or awareness of the wider world or of different opinions or ways of life."}	The narrow-minded people in the countryside are not open to new ideas.	https://utfs.io/a/ubp4bdepbl/fkClDhMQd7TE6XWLceVa9HvtmCzUZoWN10p2qhedE87yuTDx	https://www.vocabulary.com/dictionary/narrow-minded	Vocabulary.com	1	\N	50285181-4b29-40cb-9c9c-fde1b1491419	2025-06-17 13:34:37.65	2025-06-17 13:34:37.65
\.


--
-- Data for Name: vocabulary_practice; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.vocabulary_practice (id, user_id, vocabulary_id, success_rate, last_practiced, next_review, created_at) FROM stdin;
\.


--
-- Name: chunk_constraint_name; Type: SEQUENCE SET; Schema: _timescaledb_catalog; Owner: cloud_admin
--

SELECT pg_catalog.setval('_timescaledb_catalog.chunk_constraint_name', 1, false);


--
-- Name: chunk_id_seq; Type: SEQUENCE SET; Schema: _timescaledb_catalog; Owner: cloud_admin
--

SELECT pg_catalog.setval('_timescaledb_catalog.chunk_id_seq', 1, false);


--
-- Name: continuous_agg_migrate_plan_step_step_id_seq; Type: SEQUENCE SET; Schema: _timescaledb_catalog; Owner: cloud_admin
--

SELECT pg_catalog.setval('_timescaledb_catalog.continuous_agg_migrate_plan_step_step_id_seq', 1, false);


--
-- Name: dimension_id_seq; Type: SEQUENCE SET; Schema: _timescaledb_catalog; Owner: cloud_admin
--

SELECT pg_catalog.setval('_timescaledb_catalog.dimension_id_seq', 1, false);


--
-- Name: dimension_slice_id_seq; Type: SEQUENCE SET; Schema: _timescaledb_catalog; Owner: cloud_admin
--

SELECT pg_catalog.setval('_timescaledb_catalog.dimension_slice_id_seq', 1, false);


--
-- Name: hypertable_id_seq; Type: SEQUENCE SET; Schema: _timescaledb_catalog; Owner: cloud_admin
--

SELECT pg_catalog.setval('_timescaledb_catalog.hypertable_id_seq', 1, false);


--
-- Name: bgw_job_id_seq; Type: SEQUENCE SET; Schema: _timescaledb_config; Owner: cloud_admin
--

SELECT pg_catalog.setval('_timescaledb_config.bgw_job_id_seq', 1000, false);


--
-- Name: Banner Banner_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Banner"
    ADD CONSTRAINT "Banner_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: LessonSubmission LessonSubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LessonSubmission"
    ADD CONSTRAINT "LessonSubmission_pkey" PRIMARY KEY (id);


--
-- Name: Lesson Lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: comment_reaction comment_reaction_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_reaction
    ADD CONSTRAINT comment_reaction_pkey PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: reference_data reference_data_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reference_data
    ADD CONSTRAINT reference_data_pkey PRIMARY KEY (id);


--
-- Name: student_profile student_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_profile
    ADD CONSTRAINT student_profile_pkey PRIMARY KEY (id);


--
-- Name: study_activity study_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.study_activity
    ADD CONSTRAINT study_activity_pkey PRIMARY KEY (id);


--
-- Name: teacher_profile teacher_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_profile
    ADD CONSTRAINT teacher_profile_pkey PRIMARY KEY (id);


--
-- Name: token_package token_package_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.token_package
    ADD CONSTRAINT token_package_pkey PRIMARY KEY (id);


--
-- Name: token_wallet token_wallet_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.token_wallet
    ADD CONSTRAINT token_wallet_pkey PRIMARY KEY (id);


--
-- Name: transaction transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (id);


--
-- Name: vocabulary vocabulary_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vocabulary
    ADD CONSTRAINT vocabulary_pkey PRIMARY KEY (id);


--
-- Name: vocabulary_practice vocabulary_practice_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vocabulary_practice
    ADD CONSTRAINT vocabulary_practice_pkey PRIMARY KEY (id);


--
-- Name: Comment_identifier_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Comment_identifier_id_idx" ON public."Comment" USING btree (identifier_id);


--
-- Name: Comment_parent_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Comment_parent_id_idx" ON public."Comment" USING btree (parent_id);


--
-- Name: Comment_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Comment_user_id_idx" ON public."Comment" USING btree (user_id);


--
-- Name: LessonSubmission_graded_by_graded_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LessonSubmission_graded_by_graded_at_idx" ON public."LessonSubmission" USING btree (graded_by, graded_at);


--
-- Name: LessonSubmission_lesson_id_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LessonSubmission_lesson_id_user_id_idx" ON public."LessonSubmission" USING btree (lesson_id, user_id);


--
-- Name: LessonSubmission_status_submitted_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LessonSubmission_status_submitted_at_idx" ON public."LessonSubmission" USING btree (status, submitted_at);


--
-- Name: Lesson_created_by_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Lesson_created_by_idx" ON public."Lesson" USING btree (created_by);


--
-- Name: Lesson_level_code_topic_code_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Lesson_level_code_topic_code_idx" ON public."Lesson" USING btree (level_code, topic_code);


--
-- Name: Lesson_skill_status_deleted_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Lesson_skill_status_deleted_at_idx" ON public."Lesson" USING btree (skill, status, deleted_at);


--
-- Name: User_deleted_at_role_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "User_deleted_at_role_idx" ON public."User" USING btree (deleted_at, role);


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: comment_reaction_comment_id_user_id_type_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX comment_reaction_comment_id_user_id_type_key ON public.comment_reaction USING btree (comment_id, user_id, type);


--
-- Name: notification_created_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX notification_created_at_idx ON public.notification USING btree (created_at);


--
-- Name: notification_is_global_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX notification_is_global_idx ON public.notification USING btree (is_global);


--
-- Name: notification_type_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX notification_type_user_id_idx ON public.notification USING btree (type, user_id);


--
-- Name: reference_data_code_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX reference_data_code_key ON public.reference_data USING btree (code);


--
-- Name: reference_data_type_code_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX reference_data_type_code_key ON public.reference_data USING btree (type, code);


--
-- Name: reference_data_type_is_active_order_index_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX reference_data_type_is_active_order_index_idx ON public.reference_data USING btree (type, is_active, order_index);


--
-- Name: student_profile_deleted_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX student_profile_deleted_at_idx ON public.student_profile USING btree (deleted_at);


--
-- Name: student_profile_user_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX student_profile_user_id_key ON public.student_profile USING btree (user_id);


--
-- Name: study_activity_user_id_activity_date_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX study_activity_user_id_activity_date_idx ON public.study_activity USING btree (user_id, activity_date);


--
-- Name: study_activity_user_id_activity_date_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX study_activity_user_id_activity_date_key ON public.study_activity USING btree (user_id, activity_date);


--
-- Name: teacher_profile_deleted_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX teacher_profile_deleted_at_idx ON public.teacher_profile USING btree (deleted_at);


--
-- Name: teacher_profile_user_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX teacher_profile_user_id_key ON public.teacher_profile USING btree (user_id);


--
-- Name: token_package_code_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX token_package_code_key ON public.token_package USING btree (code);


--
-- Name: token_wallet_deleted_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX token_wallet_deleted_at_idx ON public.token_wallet USING btree (deleted_at);


--
-- Name: token_wallet_user_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX token_wallet_user_id_key ON public.token_wallet USING btree (user_id);


--
-- Name: transaction_payment_date_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX transaction_payment_date_idx ON public.transaction USING btree (payment_date);


--
-- Name: transaction_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX transaction_status_idx ON public.transaction USING btree (status);


--
-- Name: transaction_transaction_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX transaction_transaction_id_key ON public.transaction USING btree (transaction_id);


--
-- Name: transaction_transaction_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX transaction_transaction_type_idx ON public.transaction USING btree (transaction_type);


--
-- Name: transaction_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX transaction_user_id_idx ON public.transaction USING btree (user_id);


--
-- Name: vocabulary_created_by_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX vocabulary_created_by_idx ON public.vocabulary USING btree (created_by);


--
-- Name: vocabulary_next_review_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX vocabulary_next_review_idx ON public.vocabulary USING btree (next_review);


--
-- Name: vocabulary_practice_next_review_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX vocabulary_practice_next_review_idx ON public.vocabulary_practice USING btree (next_review);


--
-- Name: vocabulary_practice_user_id_vocabulary_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX vocabulary_practice_user_id_vocabulary_id_key ON public.vocabulary_practice USING btree (user_id, vocabulary_id);


--
-- Name: vocabulary_term_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX vocabulary_term_idx ON public.vocabulary USING btree (term);


--
-- Name: Comment Comment_lessonSubmissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_lessonSubmissionId_fkey" FOREIGN KEY ("lessonSubmissionId") REFERENCES public."LessonSubmission"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LessonSubmission LessonSubmission_graded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LessonSubmission"
    ADD CONSTRAINT "LessonSubmission_graded_by_fkey" FOREIGN KEY (graded_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LessonSubmission LessonSubmission_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LessonSubmission"
    ADD CONSTRAINT "LessonSubmission_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LessonSubmission LessonSubmission_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LessonSubmission"
    ADD CONSTRAINT "LessonSubmission_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lesson Lesson_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lesson Lesson_level_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_level_code_fkey" FOREIGN KEY (level_code) REFERENCES public.reference_data(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lesson Lesson_topic_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_topic_code_fkey" FOREIGN KEY (topic_code) REFERENCES public.reference_data(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: comment_reaction comment_reaction_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_reaction
    ADD CONSTRAINT comment_reaction_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comment_reaction comment_reaction_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.comment_reaction
    ADD CONSTRAINT comment_reaction_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification notification_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_created_by_fkey FOREIGN KEY (created_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification notification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: student_profile student_profile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_profile
    ADD CONSTRAINT student_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: study_activity study_activity_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.study_activity
    ADD CONSTRAINT study_activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teacher_profile teacher_profile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_profile
    ADD CONSTRAINT teacher_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: token_wallet token_wallet_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.token_wallet
    ADD CONSTRAINT token_wallet_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: transaction transaction_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.token_package(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transaction transaction_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vocabulary vocabulary_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vocabulary
    ADD CONSTRAINT vocabulary_created_by_fkey FOREIGN KEY (created_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: vocabulary_practice vocabulary_practice_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vocabulary_practice
    ADD CONSTRAINT vocabulary_practice_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vocabulary_practice vocabulary_practice_vocabulary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vocabulary_practice
    ADD CONSTRAINT vocabulary_practice_vocabulary_id_fkey FOREIGN KEY (vocabulary_id) REFERENCES public.vocabulary(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

