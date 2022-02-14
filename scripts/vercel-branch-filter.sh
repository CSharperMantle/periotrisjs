#!/bin/sh

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "develop" || "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "_perf"  ]] ; then
  # Allow all commits on develop and main branches to be deployed
  echo "✅ - Build can proceed"
  exit 1;
else
  # Reject all other commits
  echo "🛑 - Build cancelled"
  exit 0;
fi
