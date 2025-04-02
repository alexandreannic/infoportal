-- AddForeignKey
ALTER TABLE "KoboForm" ADD CONSTRAINT "KoboForm_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "KoboServer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
