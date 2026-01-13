
# Product Requirements Document (PRD):

## 1. プロダクト概要

本システムは、企業内の膨大なリソースデータ（在庫、人事、財務、プロジェクト）を一元管理し、AIによる自然言語解析と予測を提供する次世代ERPプラットフォーム。

* **コアコンセプト:** 「TanStackエコシステムのフル活用」による、Webアプリの限界を超えたパフォーマンスと開発体験の実証。
* **インフラ戦略:** **Cloudflare Edge** を全面採用し、グローバル規模での低遅延アクセスと、スケーラブルかつ安価な運用を実現する。

---

## 2. 機能要件 (Functional Requirements)

### 2.1. インテリジェント・データグリッド (Data Grid Module)

* **Edge-Optimized Data Fetching:** Cloudflare D1からの高速なデータ取得により、10,000件以上のデータを遅延なく表示。
* **機能:**
* TanStack Virtualによる無限スクロール。
* TanStack Tableによる複雑なフィルタリング、ソート、グルーピング。
* URLステート同期（TanStack Router）。



### 2.2. スマート・リソースエディタ (Editor Module)

* **機能:**
* TanStack Form + Zodによる堅牢なバリデーション。
* TanStack Rangeを用いた直感的な数値入力。
* **Optimistic UI:** Cloudflareのエッジネットワークの速さを活かしつつ、さらに楽観的更新を行うことで「体感遅延ゼロ」を実現。



### 2.3. AI アナリティクス (AI Module)

* **Edge AI Integration:** Cloudflare Workers (またはOpenAI API via Workers) 上で動作するAIロジック。
* **機能:**
* 自然言語によるデータクエリ生成。
* ストリーミングレスポンスによるリアルタイム回答表示。



### 2.4. 認証・ユーザー管理 (Authentication)

* **Clerk Integration:**
* SaaSとして標準的なサインアップ/ログインフロー（Google, GitHub, Email）。
* 多要素認証 (MFA) 対応。
* 組織（Organization）機能を用いたテナント管理（企業ごとのデータ分離）。



---

## 3. 非機能要件 (Non-Functional Requirements)

* **Edge Compatibility:** すべてのサーバーサイドロジック（Server Functions）は、Node.js APIに依存せず、**Cloudflare Workers Runtime (V8 Isolate)** で動作するように設計する。
* **Performance:**
* Cloudflare Global Networkを活用し、世界中のどこからでもTTFB（Time To First Byte）を最小化する。
* D1のRead性能を最大化するため、適切なインデックス設計を行う。


* **Security:**
* ClerkのMiddlewareによるエッジレベルでのルート保護。
* Drizzle ORMによるSQLインジェクション対策。



---

## 4. 技術アーキテクチャ (Technical Architecture)

### 4.1. Core Stack

| Layer | Technology | Selection / Note |
| --- | --- | --- |
| **Framework** | **TanStack Start** | Cloudflare Pages Presetを使用。 |
| **Deployment** | **Cloudflare Pages** | 静的アセット配信 + Server Functions (Workers) のホスティング。 |
| **Database** | **Cloudflare D1** | エッジ分散型SQLite。 |
| **ORM** | **Drizzle ORM** | `drizzle-orm/d1` アダプタを使用。 |
| **Auth** | **Clerk** | `@clerk/tanstack-start` (またはRemix版) を使用し、Middlewareで保護。 |
| **State/Data** | **TanStack Query** | エッジからのデータ取得キャッシュと同期。 |
| **UI** | **shadcn/ui** | Tailwind CSSベースのコンポーネント。 |

### 4.2. データフローと認証設計

1. **Request:** ユーザーがアプリにアクセス。
2. **Auth Check (Edge):** Clerk Middlewareがリクエストをインターセプトし、認証トークンを検証。未認証ならログイン画面へリダイレクト。
3. **Data Fetch (Server Functions):**
* TanStack StartのServer Functionが起動（Cloudflare Workerとして動作）。
* Clerkから `userId` / `orgId` を取得。
* Drizzle ORMを経由して **Cloudflare D1** にクエリを投げる。
* **※重要:** D1のデータには `tenant_id` (ClerkのOrganization ID) を含め、クエリ時に必ずフィルタリングしてデータ漏洩を防ぐ。



---

## 5. データモデル案 (Schema for D1)

Clerkがユーザー認証（ID, Email, Password）を持つため、D1側では業務データのみを管理し、ClerkのIDを外部キーのように扱います。

* **Projects:**
* `id` (Int, PK)
* `tenant_id` (String, Index) -> Clerk Organization ID
* `name`, `budget`, `status` ...


* **Employees:**
* `id` (Int, PK)
* `tenant_id` (String, Index)
* `clerk_user_id` (String, Unique, Nullable) -> Clerk User ID（アプリ上のユーザーと従業員データを紐付ける場合）
* `name`, `role` ...


* **Inventory:**
* `id` (Int, PK)
* `tenant_id` (String, Index)
* ...



---

## 6. 開発マイルストーン (Revised)

1. **Phase 1: Environment Setup**
* TanStack Start + Cloudflare Pagesのプロジェクト初期化。
* ClerkのセットアップとMiddleware実装。
* Cloudflare D1の作成とDrizzleの接続設定。


2. **Phase 2: The Grid & Edge Data**
* D1へのシードデータ投入（ローカル開発は `wrangler dev` を使用）。
* Server Functionsでのデータ取得実装。
* TanStack Table + Virtualによるグリッド表示。


3. **Phase 3: Mutation & Optimistic UI**
* 編集機能（Form）の実装。
* 更新処理におけるOptimistic Updatesの実装。


4. **Phase 4: AI & Final Polish**
* AI機能の統合（OpenAI API等へのFetch処理）。
* デプロイパイプラインの整備。
