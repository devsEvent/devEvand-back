import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
<<<<<<< HEAD
=======
  exports: [PrismaService],
>>>>>>> 771f61a3592669018d08c9a677197b198402399b
})
export class PrismaModule {}
