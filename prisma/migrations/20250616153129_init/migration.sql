-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "questionRef" TEXT NOT NULL,
    "explanation" TEXT,
    "type" TEXT NOT NULL,
    "options" JSONB,
    "complianceImplicationIfNo" TEXT,
    "complianceImplicationIfSelected" JSONB,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserResponse" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "answer" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "UserResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
